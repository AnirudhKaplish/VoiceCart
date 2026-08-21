import { ParsedCommand, SupportedLanguage, ParsedItemEntity } from '@/types/voice';
import { ProductCategory } from '@/types/shopping';
import { splitCompoundItems } from './tokenizer';
import { extractItemEntity, extractPriceFilter } from './entityExtractor';
import { INTENT_KEYWORDS } from './multilingual';

export function parseNaturalCommand(
  rawTranscript: string,
  language: SupportedLanguage = 'en-US'
): ParsedCommand {
  const trimmed = rawTranscript.trim();

  if (!trimmed) {
    return {
      rawTranscript: '',
      action: 'UNKNOWN',
      items: [],
      confidence: 0,
      feedbackMessage: "I didn't catch anything. Please try speaking or typing a command.",
      language
    };
  }

  const lower = trimmed.toLowerCase();

  // 1. UNDO COMMAND
  if (
    lower === 'undo' ||
    lower === 'revert' ||
    lower.startsWith('undo ') ||
    INTENT_KEYWORDS.UNDO.some(k => lower.includes(k))
  ) {
    return {
      rawTranscript: trimmed,
      action: 'UNDO',
      items: [],
      confidence: 0.95,
      feedbackMessage: 'Reverting your previous action.',
      language
    };
  }

  // 2. CLEAR LIST COMMAND
  if (
    lower.includes('clear list') ||
    lower.includes('clear all') ||
    lower.includes('delete all') ||
    lower.includes('empty my list') ||
    INTENT_KEYWORDS.CLEAR_LIST.some(k => lower.includes(k))
  ) {
    return {
      rawTranscript: trimmed,
      action: 'CLEAR_LIST',
      items: [],
      confidence: 0.95,
      feedbackMessage: 'Clearing all items from your shopping list.',
      language
    };
  }

  // 3. SHOW / VIEW LIST COMMAND
  if (
    lower.includes("what's on my list") ||
    lower.includes('what is on my list') ||
    lower.includes('show list') ||
    lower.includes('view list') ||
    lower.includes('show my shopping list') ||
    lower === 'list' ||
    INTENT_KEYWORDS.SHOW_LIST.some(k => lower.includes(k))
  ) {
    return {
      rawTranscript: trimmed,
      action: 'SHOW_LIST',
      items: [],
      confidence: 0.9,
      feedbackMessage: 'Opening your shopping list.',
      language
    };
  }

  // 4. MARK AS PURCHASED / CHECK OFF
  // e.g., "Mark bread as bought", "Check off apples", "I bought the milk", "Mark milk done"
  const markRegex = /^(?:please\s+)?(?:mark|check|set|tick)\s+(.+?)\s+(?:as\s+)?(?:bought|purchased|done|completed|checked|got it)|^(?:i\s+)?(?:bought|got|purchased)\s+(?:the\s+)?(.+)/i;
  const markMatch = trimmed.match(markRegex);
  if (markMatch || INTENT_KEYWORDS.MARK_PURCHASED.some(k => lower.includes(k) && !lower.startsWith('buy '))) {
    let target = markMatch ? (markMatch[1] || markMatch[2]) : trimmed;
    target = target.replace(/(?:mark|as bought|bought|as purchased|check off|done)/gi, '').trim();

    const entity = extractItemEntity(target);
    return {
      rawTranscript: trimmed,
      action: 'MARK_PURCHASED',
      items: [entity],
      confidence: 0.9,
      feedbackMessage: `Marked "${entity.name}" as purchased.`,
      language
    };
  }

  // 5. UPDATE / CHANGE QUANTITY
  // e.g., "Change apples to 5", "Update milk to 2 cartons", "Make bread 2"
  const updateRegex = /^(?:please\s+)?(?:change|update|make|set)\s+(.+?)\s+(?:to|as)\s+(\d+(?:\.\d+)?|\w+)(?:\s+([a-zA-Z]+))?/i;
  const updateMatch = trimmed.match(updateRegex);
  if (updateMatch) {
    const itemName = updateMatch[1].trim();
    const qtyRaw = updateMatch[2].trim();
    const unitRaw = updateMatch[3]?.trim();
    const entity = extractItemEntity(`${qtyRaw} ${unitRaw || ''} ${itemName}`);

    return {
      rawTranscript: trimmed,
      action: 'UPDATE_ITEM',
      items: [{
        raw: trimmed,
        name: itemName.charAt(0).toUpperCase() + itemName.slice(1),
        quantity: entity.quantity,
        unit: unitRaw || entity.unit,
        category: entity.category
      }],
      confidence: 0.92,
      feedbackMessage: `Updated "${itemName}" quantity to ${entity.quantity} ${unitRaw || ''}`.trim(),
      language
    };
  }

  // 6. REMOVE / DELETE ITEM
  // e.g., "Remove milk", "Delete bananas", "Take bread off my list", "Drop eggs"
  const removeRegex = /^(?:please\s+)?(?:remove|delete|drop|take\s+off|discard)\s+(?:the\s+)?(.+?)(?:\s+(?:from|off)\s+(?:my\s+)?(?:shopping\s+)?list)?$/i;
  const removeMatch = trimmed.match(removeRegex);
  if (removeMatch || INTENT_KEYWORDS.REMOVE.some(k => lower.startsWith(k + ' '))) {
    let target = removeMatch ? removeMatch[1] : trimmed.replace(/^(remove|delete|drop|hatao|nikalo|neekavum)\s+/i, '');
    target = target.replace(/\s+(from|off)\s+(my\s+)?list$/i, '').trim();

    const entity = extractItemEntity(target);
    return {
      rawTranscript: trimmed,
      action: 'REMOVE_ITEM',
      items: [entity],
      confidence: 0.9,
      feedbackMessage: `Removed "${entity.name}" from your list.`,
      language
    };
  }

  // 7. SEARCH PRODUCT & PRICE / CATEGORY FILTERING
  // e.g., "Find organic apples", "Find toothpaste under $5", "Show me Dove toothpaste", "Show dairy products", "Find milk between $2 and $5"
  const searchTriggers = ['find', 'search', 'look for', 'show me', 'show', 'where is', 'filter', 'dhoondo', 'khojo', 'dikhao', 'thedu'];
  const startsWithSearch = searchTriggers.some(t => lower.startsWith(t + ' ') || lower === t);

  if (startsWithSearch) {
    const queryPayload = trimmed.replace(/^(find|search\s+for|search|look\s+for|show\s+me|show|where\s+is|filter|dhoondo|khojo|dikhao|thedu)\s+/i, '').trim();
    
    // Extract price filter if mentioned (e.g. "toothpaste under $5", "milk between $2 and $5")
    const { minPrice, maxPrice, extractedQuery } = extractPriceFilter(queryPayload);

    // Check for category keywords in query (e.g., "Show dairy products", "Produce")
    const categories: ProductCategory[] = ['Produce', 'Dairy', 'Bakery', 'Beverages', 'Snacks', 'Pantry', 'Household', 'Personal Care'];
    let matchedCategory: ProductCategory | undefined = undefined;
    for (const cat of categories) {
      if (new RegExp(`\\b${cat.toLowerCase()}\\b`, 'i').test(extractedQuery)) {
        matchedCategory = cat;
        break;
      }
    }

    // Clean up residual words like "products", "items", "section"
    const cleanedSearchTerm = extractedQuery
      .replace(/\b(products|items|options|brands|section)\b/gi, '')
      .trim();

    let feedback = `Searching for "${cleanedSearchTerm || matchedCategory || 'products'}"`;
    if (minPrice !== undefined && maxPrice !== undefined) {
      feedback += ` between $${minPrice} and $${maxPrice}`;
    } else if (maxPrice !== undefined) {
      feedback += ` under $${maxPrice}`;
    } else if (minPrice !== undefined) {
      feedback += ` over $${minPrice}`;
    }

    return {
      rawTranscript: trimmed,
      action: 'SEARCH_PRODUCT',
      items: [],
      searchQuery: cleanedSearchTerm,
      categoryFilter: matchedCategory,
      minPrice,
      maxPrice,
      confidence: 0.92,
      feedbackMessage: feedback + '.',
      language
    };
  }

  // 8. ADD ITEM(S) — Default fallback for grocery list phrases
  // Examples:
  // - "Add milk"
  // - "I need apples"
  // - "Add 2 bottles of water"
  // - "Buy 5 oranges"
  // - "Add 2 apples, 1 kg rice and 3 bottles of water"
  // - "I want to buy bananas"
  // - "Put bananas on my list"
  // - "doodh aur do seb add karo"

  // Split multi-item conjunctions
  const itemPhrases = splitCompoundItems(trimmed);
  const parsedEntities: ParsedItemEntity[] = itemPhrases
    .map(p => extractItemEntity(p))
    .filter(e => e.name.length > 0);

  if (parsedEntities.length > 0) {
    let summary = '';
    if (parsedEntities.length === 1) {
      const e = parsedEntities[0];
      const unitStr = e.unit ? ` ${e.unit}` : '';
      summary = `Added ${e.quantity}${unitStr} ${e.name} to ${e.category || 'your list'}.`;
    } else {
      const itemSummaries = parsedEntities.map(e => `${e.quantity}${e.unit ? ` ${e.unit}` : ''} ${e.name}`);
      summary = `Added ${itemSummaries.join(', ')} to your list.`;
    }

    return {
      rawTranscript: trimmed,
      action: 'ADD_ITEM',
      items: parsedEntities,
      confidence: 0.95,
      feedbackMessage: summary,
      language
    };
  }

  // 9. UNKNOWN COMMAND
  return {
    rawTranscript: trimmed,
    action: 'UNKNOWN',
    items: [],
    confidence: 0.2,
    feedbackMessage: `I didn't understand "${trimmed}". Try saying "Add 2 apples" or "Find toothpaste under $5".`,
    language
  };
}
