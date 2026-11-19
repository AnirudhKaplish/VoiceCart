# VoiceCart — Voice Command Shopping Assistant

**Live demo:** https://anirudhkaplish.github.io/VoiceCart/

> **"Just say what you need."**  
> A voice-first consumer grocery shopping application built with Next.js 16, TypeScript, Tailwind CSS, and the Web Speech API.

[![Tests](https://img.shields.io/badge/tests-28%20passed-emerald)](https://github.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8)](https://tailwindcss.com/)

---

## 1. Problem

Traditional grocery and shopping list apps require extensive manual typing, searching, and selecting nested dropdowns. When managing a kitchen or pantry in real-time, users often have their hands full, making typing inconvenient. Existing generic list apps also treat all items identically, without understanding compound grocery phrases (quantities, units), replenishment schedules, dietary preferences, or out-of-stock product substitutions.

---

## 2. Solution

**VoiceCart** provides an effortless, conversational shopping list experience. Users tap a single glowing microphone and speak naturally (e.g., *"Add 2 apples, 1 kg rice and 3 bottles of water"* or *"Find toothpaste under $5"*). 

The application instantly:
1. Transcribes speech in real time with live waveform feedback.
2. Extracts individual entities, quantities, and units via a deterministic NLP parser.
3. Organizes products automatically into supermarket categories (**Produce**, **Dairy**, **Bakery**, **Beverages**, **Snacks**, **Pantry**, **Household**, **Personal Care**).
4. Analyzes historical purchase frequency to deliver contextual replenishment alerts (e.g., *"You usually buy milk every 7 days"*).
5. Suggests in-season favorites and healthy out-of-stock substitutes with a single tap.
6. Provides full manual text fallback, multilingual speech (English, Hindi, Tamil), audio confirmations, and undo capabilities.

---

## 3. Key Features

- **Voice-First Hero Interface**: 5 polished UX states (`READY`, `LISTENING` with animated audio waveform, `PROCESSING`, `SUCCESS` with undo, `ERROR` with retry guidance).
- **Multi-Item & Entity Parsing**: Parses compound utterances into distinct products, numbers, and units (`kg`, `liters`, `bottles`, `packs`, `boxes`, `bunches`, `loaves`).
- **Voice-Activated Product Discovery**: Voice search with price constraints (*"Find toothpaste under $5"*, *"Find milk between $2 and $5"*).
- **Smart Replenishment Engine**: Historical interval calculations (pre-seeded with realistic shopping history) triggering contextual *"Running low on milk?"* reminders.
- **Dietary & Out-of-Stock Substitutions**: Alternative product recommendations (e.g. Whole Milk → Califia Almond Milk or Oatly Oat Milk).
- **Categorized Shopping List**: Real-time progress bar, quantity steppers, strike-through completion, delete, clear list, and undo toast stack.
- **Multilingual Support**: Supports English (`en-US`, `en-IN`), Hindi (`hi-IN`), and Tamil (`ta-IN`).
- **Spoken Confirmations**: Text-to-speech audio feedback using `window.speechSynthesis`.
- **Text-Command Fallback & Guided Demo**: Evaluators and users without microphones can execute the exact same NLP pipeline by typing or clicking sample prompts.

---

## 4. Architecture & Data Flow

```
                  ┌──────────────────────┐
                  │   User Voice Input   │
                  └──────────┬───────────┘
                             │ (Web Speech API)
                             ▼
                    Live Speech Transcript
                             │
            ┌────────────────┴────────────────┐
            │                                 │
            ▼                                 ▼
   Voice Transcript                  Text Command Fallback
            │                                 │
            └────────────────┬────────────────┘
                             │
                             ▼
               ┌───────────────────────────┐
               │   NLP Command Parser      │
               │  - Tokenizer & Chunker    │
               │  - Entity Extractor       │
               │  - Multilingual Vocab     │
               └─────────────┬─────────────┘
                             │
                             ▼
                   Structured Command
        { action: 'ADD_ITEM', items: [{ name: 'Apples', qty: 2 }] }
                             │
       ┌─────────────────────┼─────────────────────┐
       ▼                     ▼                     ▼
 Shopping Context      Product Context       Voice Synthesis
 (List State, Undo)   (Search & Filters)   (Audio Feedback)
```

---

## 5. NLP Command Parser Specifications

The parser module (`src/lib/parser/commandParser.ts`) is completely decoupled from the speech-recognition layer. It processes inputs into structured commands:

| Natural Voice / Text Phrase | Action Extracted | Parsed Details |
|---|---|---|
| *"Add 2 apples and a bottle of milk"* | `ADD_ITEM` | `[{ name: 'Apples', qty: 2 }, { name: 'Milk', qty: 1, unit: 'bottle' }]` |
| *"Add 1 kg rice, 3 bananas and bread"* | `ADD_ITEM` | `[{ name: 'Rice', qty: 1, unit: 'kg' }, { name: 'Bananas', qty: 3 }, { name: 'Bread', qty: 1 }]` |
| *"Remove milk"* | `REMOVE_ITEM` | Target: `'Milk'` |
| *"Change apples to 5"* | `UPDATE_ITEM` | Target: `'Apples'`, New Qty: `5` |
| *"Mark bread as bought"* | `MARK_PURCHASED` | Target: `'Bread'` |
| *"Find organic apples"* | `SEARCH_PRODUCT` | Query: `'organic apples'` |
| *"Find toothpaste under $5"* | `SEARCH_PRODUCT` | Query: `'toothpaste'`, `maxPrice: 5` |
| *"Find beverages between $2 and $8"* | `SEARCH_PRODUCT` | Query: `'beverages'`, `minPrice: 2`, `maxPrice: 8` |
| *"What's on my list?"* | `SHOW_LIST` | Navigates to `/list` |
| *"Clear list"* | `CLEAR_LIST` | Empties list with Undo stack |
| *"Undo last action"* | `UNDO` | Reverts last operation |
| *"doodh add karo"* (Hindi) | `ADD_ITEM` | Item: `'Doodh'`, Category: `Dairy` |
| *"paal serkavum"* (Tamil) | `ADD_ITEM` | Item: `'Paal'`, Category: `Dairy` |

---

## 6. Smart Recommendation Logic

The recommendation engine (`src/lib/recommendations/recommendationEngine.ts`) applies 4 distinct heuristics:

1. **Replenishment Cycle Prediction**:
   $$\text{AvgInterval} = \frac{\text{LastPurchaseDate} - \text{FirstPurchaseDate}}{\text{Count} - 1}$$
   If $\text{DaysSinceLastPurchase} \ge \text{AvgInterval} - 1$, triggers an urgent replenishment suggestion with an explanation.
2. **Out-of-Stock Substitutes**:
   When an item is out of stock in the supermarket catalog, the engine locates mapped `substituteProductIds` and presents dietary alternatives.
3. **Seasonal & Promotion Highlights**:
   Scans catalog for in-season flags (e.g., Honeycrisp Apples in autumn, fresh strawberries).
4. **Contextual "Why recommended?" Badges**:
   Every card displays an expandable indicator with exact purchase metrics and context.

---

## 7. Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Voice APIs**: Browser Web Speech API (`SpeechRecognition` + `speechSynthesis`)
- **State & Persistence**: React Context API + LocalStorage
- **Testing**: [Vitest](https://vitest.dev/) (28 Unit Tests)

---

## 8. Local Setup & Commands

### Prerequisites
- Node.js 18.17+ or 20+
- npm 9+

### Installation & Run

```bash
# 1. Clone or navigate to the project directory
cd voicecart

# 2. Install dependencies
npm install

# 3. Run automated test suite
npm run test

# 4. Run ESLint verification
npm run lint

# 5. Build for production
npm run build

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 9. Browser Compatibility

| Browser | Speech Recognition | Audio Synthesis | Fallback Mode |
|---|---|---|---|
| **Google Chrome (Desktop & Android)** | Native Full Support | Native Full Support | Available |
| **Microsoft Edge** | Native Full Support | Native Full Support | Available |
| **Safari (iOS & macOS)** | `webkitSpeechRecognition` | Native Full Support | Available |
| **Mozilla Firefox / Headless** | Text Fallback | Native Full Support | Text Input + Sample Chips |

---

## 10. Technical Assessment Write-Up (< 200 Words)

> **VoiceCart** is a mobile-first, voice-centered shopping assistant engineered with Next.js 16, TypeScript, and Tailwind CSS. To deliver zero-latency consumer interactions, speech recognition is implemented via native Web Speech APIs with a dedicated NLP parser decoupled from UI layers. The parser extracts multi-item entities, fractional quantities, units, and price boundaries (*"Add 2 apples, 1 kg rice and 3 bottles of water"*, *"Find toothpaste under $5"*). Items are automatically classified into supermarket categories. A smart recommendation engine calculates replenishment intervals from historical shopping trips (e.g., weekly milk cycles) and identifies out-of-stock substitutes (Whole Milk → Oat Milk). The application features 5 distinct voice interaction states, real-time waveform visualizers, multilingual recognition (English, Hindi, Tamil), auditory synthesis confirmations, reversible undo stacks, and a resilient text fallback for non-speech environments.

---

## 11. Deployment

VoiceCart is fully optimized for static deployment on **Vercel**, **Cloudflare Pages**, or **AWS Amplify**:

```bash
# Build production bundle
npm run build

# Start production server
npm run start
```
No external paid API keys or secret environment variables are required for standard local and cloud execution.
