import { ParsedItemEntity } from '@/types/voice';
import { inferCategory } from '@/lib/utils/categories';

// Word to number mapping
const WORD_NUMBERS: Record<string, number> = {
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  dozen: 12,
  'half dozen': 6,
  'half a dozen': 6,
  half: 0.5,
  pair: 2,
  'a pair of': 2,
  // Hindi numbers
  ek: 1,
  do: 2,
  teen: 3,
  char: 4,
  paanch: 5,
  chheh: 6,
  saat: 7,
  aath: 8,
  nau: 9,
  das: 10,
  aadha: 0.5,
  // Tamil numbers
  onru: 1,
  oru: 1,
  irandu: 2,
  moonru: 3,
  naangu: 4,
  ainthu: 5,
  aaru: 6,
  aara: 0.5
};

const COMMON_UNITS = [
  'bottle', 'bottles',
  'packet', 'packets', 'pack', 'packs', 'pkt',
  'box', 'boxes',
  'kg', 'kgs', 'kilogram', 'kilograms', 'kilo', 'kilos',
  'g', 'gm', 'gms', 'gram', 'grams',
  'lb', 'lbs', 'pound', 'pounds',
  'liter', 'liters', 'litre', 'litres', 'l',
  'ml', 'milliliter', 'milliliters',
  'can', 'cans',
  'bag', 'bags',
  'loaf', 'loaves',
  'bunch', 'bunches',
  'tub', 'tubs',
  'cup', 'cups',
  'tube', 'tubes',
  'bar', 'bars',
  'jar', 'jars',
  'piece', 'pieces', 'pcs', 'ct', 'count'
];

export function extractItemEntity(rawPhrase: string): ParsedItemEntity {
  let cleaned = rawPhrase.trim();

  // Strip conversational or filler prefixes
  cleaned = cleaned.replace(/^(?:i\s+need|i\s+want\s+to\s+buy|i\s+want|i\s+would\s+like|please\s+add|please|add|buy|get|put|some|any|few|the|my)\s+/i, '');

  let quantity = 1;
  let unit: string | undefined = undefined;

  // 1. Check for numeric digits or decimal (e.g. "2", "2.5", "1/2")
  const numericMatch = cleaned.match(/^(\d+(?:\.\d+)?|\d+\/\d+)\s*/i);
  if (numericMatch) {
    if (numericMatch[1].includes('/')) {
      const [num, den] = numericMatch[1].split('/');
      quantity = parseFloat(num) / parseFloat(den);
    } else {
      quantity = parseFloat(numericMatch[1]);
    }
    cleaned = cleaned.slice(numericMatch[0].length).trim();
  } else {
    // 2. Check for word numbers at the beginning (e.g., "two", "a dozen", "half a dozen", "a")
    for (const [word, numVal] of Object.entries(WORD_NUMBERS)) {
      const regex = new RegExp(`^${word}\\s+`, 'i');
      if (regex.test(cleaned)) {
        quantity = numVal;
        cleaned = cleaned.replace(regex, '').trim();
        break;
      }
    }
  }

  // 3. Extract unit (e.g. "bottles of water", "kg rice", "loaf of bread")
  for (const u of COMMON_UNITS) {
    const unitRegex = new RegExp(`^${u}(\\s+of)?\\s+`, 'i');
    if (unitRegex.test(cleaned)) {
      unit = u.toLowerCase();
      cleaned = cleaned.replace(unitRegex, '').trim();
      break;
    }
  }

  // Secondary cleanup of filler words
  cleaned = cleaned.replace(/^(?:some|any|of|for|the)\s+/i, '').trim();
  cleaned = cleaned.replace(/[.,!?;]+$/, '').trim();

  // Capitalize words
  const formattedName = cleaned
    ? cleaned
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : 'Item';

  const category = inferCategory(formattedName);

  return {
    raw: rawPhrase,
    name: formattedName,
    quantity: Math.max(0.1, quantity),
    unit,
    category
  };
}

export interface PriceRangeExtraction {
  minPrice?: number;
  maxPrice?: number;
  extractedQuery: string;
}

export function extractPriceFilter(input: string): PriceRangeExtraction {
  let cleaned = input;
  let minPrice: number | undefined = undefined;
  let maxPrice: number | undefined = undefined;

  // Pattern: "between $2 and $5" or "from 2 to 5 dollars" or "between 2 to 5"
  const rangeMatch = cleaned.match(/(?:between|from)\s+\$?(\d+(?:\.\d+)?)\s*(?:and|to|-)\s*\$?(\d+(?:\.\d+)?)(?:\s*dollars?)?/i);
  if (rangeMatch) {
    minPrice = parseFloat(rangeMatch[1]);
    maxPrice = parseFloat(rangeMatch[2]);
    cleaned = cleaned.replace(rangeMatch[0], ' ');
  } else {
    // Pattern: "under $5", "below 5 dollars", "less than 5", "cheaper than $5", "max 5"
    const maxMatch = cleaned.match(/(?:under|below|less than|cheaper than|max|up to)\s+\$?(\d+(?:\.\d+)?)(?:\s*dollars?)?/i);
    if (maxMatch) {
      maxPrice = parseFloat(maxMatch[1]);
      cleaned = cleaned.replace(maxMatch[0], ' ');
    }

    // Pattern: "above $10", "over 10 dollars", "more than 10", "min 10"
    const minMatch = cleaned.match(/(?:above|over|more than|min|at least)\s+\$?(\d+(?:\.\d+)?)(?:\s*dollars?)?/i);
    if (minMatch) {
      minPrice = parseFloat(minMatch[1]);
      cleaned = cleaned.replace(minMatch[0], ' ');
    }
  }

  return {
    minPrice,
    maxPrice,
    extractedQuery: cleaned.replace(/\s+/g, ' ').trim()
  };
}
