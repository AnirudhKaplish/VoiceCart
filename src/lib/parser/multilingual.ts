import { LanguageOption } from '@/types/voice';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en-US',
    label: 'English (US)',
    nativeLabel: 'English (US)',
    flag: '🇺🇸'
  },
  {
    code: 'en-IN',
    label: 'English (India)',
    nativeLabel: 'English (India)',
    flag: '🇮🇳'
  },
  {
    code: 'hi-IN',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    flag: '🇮🇳'
  },
  {
    code: 'ta-IN',
    label: 'Tamil',
    nativeLabel: 'தமிழ்',
    flag: '🇮🇳'
  }
];

export const INTENT_KEYWORDS = {
  ADD: [
    // English
    'add', 'put', 'buy', 'need', 'get', 'include', 'insert', 'want', 'pick up', 'bring',
    // Hindi (Latin + Devanagari)
    'jodo', 'daalo', 'kharido', 'chahiye', 'lao', 'add karo', 'जोड़ो', 'डालो', 'खरीदो', 'चाहिए', 'लाओ',
    // Tamil (Latin + Tamil script)
    'serkavum', 'vaangu', 'thaevai', 'kondhuvaa', 'சேர்க்கவும்', 'வாங்கு', 'தேவை'
  ],
  REMOVE: [
    // English
    'remove', 'delete', 'drop', 'take off', 'clear', 'discard', 'get rid of',
    // Hindi
    'hatao', 'nikalo', 'delete karo', 'हटाओ', 'निकालो',
    // Tamil
    'neekavum', 'edu', 'azhi', 'நீக்கவும்', 'எடு'
  ],
  UPDATE: [
    // English
    'update', 'change', 'make', 'set', 'modify', 'adjust',
    // Hindi
    'badlo', 'change karo', 'badal do', 'बदलो',
    // Tamil
    'maatravum', 'seri sey', 'மாற்றவும்'
  ],
  MARK_PURCHASED: [
    // English
    'mark', 'bought', 'purchased', 'check', 'check off', 'done', 'got it', 'ticked', 'completed',
    // Hindi
    'kharid liya', 'ho gaya', 'kharida', 'खरीद लिया', 'हो गया',
    // Tamil
    'vaangiyaachu', 'mudithathu', 'வாங்கியாயிற்று', 'முடிந்தது'
  ],
  SEARCH: [
    // English
    'find', 'search', 'look for', 'show me', 'where is', 'filter', 'explore', 'discover',
    // Hindi
    'dhoondo', 'khojo', 'dikhao', 'ढूंढो', 'खोजो', 'दिखाओ',
    // Tamil
    'thedu', 'kaattu', 'தேடு', 'காட்டு'
  ],
  SHOW_LIST: [
    // English
    "what's on my list", 'show list', 'view list', 'show my shopping list', 'open list', 'what do i need',
    // Hindi
    'list dikhao', 'kya kya hai', 'लिस्ट दिखाओ',
    // Tamil
    'pattiyal kaattu', 'பட்டியல் காட்டு'
  ],
  CLEAR_LIST: [
    // English
    'clear list', 'clear all', 'delete all', 'empty list', 'reset list',
    // Hindi
    'puri list saaf karo', 'sab hatao', 'सब हटाओ',
    // Tamil
    'ellaathaiyum azhi', 'எல்லாவற்றையும் அழி'
  ],
  UNDO: [
    // English
    'undo', 'revert', 'cancel that', 'go back', 'oops',
    // Hindi
    'wapas karo', 'undo karo', 'वापस करो',
    // Tamil
    'pinvaangu', 'பின்வாங்கு'
  ]
};
