import { ProductCategory } from '@/types/shopping';

export interface CategoryMeta {
  name: ProductCategory;
  emoji: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export const CATEGORIES_META: Record<ProductCategory, CategoryMeta> = {
  Produce: {
    name: 'Produce',
    emoji: '🥬',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badgeText: 'text-emerald-700',
    borderColor: 'border-emerald-200'
  },
  Bakery: {
    name: 'Bakery',
    emoji: '🍞',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeText: 'text-amber-700',
    borderColor: 'border-amber-200'
  },
  Dairy: {
    name: 'Dairy',
    emoji: '🥛',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    badgeText: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  Beverages: {
    name: 'Beverages',
    emoji: '🧃',
    badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    badgeText: 'text-cyan-700',
    borderColor: 'border-cyan-200'
  },
  Snacks: {
    name: 'Snacks',
    emoji: '🍿',
    badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
    badgeText: 'text-orange-700',
    borderColor: 'border-orange-200'
  },
  Pantry: {
    name: 'Pantry',
    emoji: '🍚',
    badgeBg: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    badgeText: 'text-yellow-800',
    borderColor: 'border-yellow-200'
  },
  Household: {
    name: 'Household',
    emoji: '🧻',
    badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
    badgeText: 'text-teal-700',
    borderColor: 'border-teal-200'
  },
  'Personal Care': {
    name: 'Personal Care',
    emoji: '🧴',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    badgeText: 'text-purple-700',
    borderColor: 'border-purple-200'
  },
  Other: {
    name: 'Other',
    emoji: '🛒',
    badgeBg: 'bg-stone-50 text-stone-800 border-stone-200',
    badgeText: 'text-stone-700',
    borderColor: 'border-stone-200'
  }
};

// Evaluated in order: Bakery > Produce > Dairy > Beverages > Personal Care > Household > Snacks > Pantry
const CATEGORY_PRIORITY: ProductCategory[] = [
  'Bakery',
  'Produce',
  'Dairy',
  'Beverages',
  'Personal Care',
  'Household',
  'Snacks',
  'Pantry'
];

const CATEGORY_KEYWORD_MAP: Record<ProductCategory, string[]> = {
  Bakery: [
    'bread', 'loaf', 'loaves', 'sourdough', 'wheat bread', 'bagel', 'bagels', 'croissant',
    'croissants', 'tortilla', 'tortillas', 'muffin', 'muffins', 'bun', 'buns',
    'pita', 'roti', 'naan', 'toast', 'bakery', 'cake', 'cookies', 'pastry'
  ],
  Produce: [
    'apple', 'apples', 'banana', 'bananas', 'orange', 'oranges', 'berry', 'berries',
    'strawberry', 'strawberries', 'blueberry', 'blueberries', 'spinach', 'kale',
    'lettuce', 'tomato', 'tomatoes', 'cucumber', 'cucumbers', 'avocado', 'avocados',
    'onion', 'onions', 'garlic', 'potato', 'potatoes', 'lemon', 'lemons', 'lime', 'limes',
    'fruit', 'fruits', 'vegetable', 'vegetables', 'carrot', 'carrots', 'cilantro',
    'ginger', 'mint', 'pepper', 'peppers', 'grapes', 'mango', 'watermelon', 'seb', 'kela', 'aappil'
  ],
  Dairy: [
    'milk', 'whole milk', 'almond milk', 'oat milk', 'soy milk', 'cream', 'butter',
    'cheese', 'cheddar', 'mozzarella', 'parmesan', 'yogurt', 'curd', 'dahi', 'paneer',
    'egg', 'eggs', 'ghee', 'dairy', 'fage', 'chobani', 'kerrygold', 'doodh', 'paal', 'muttai'
  ],
  Beverages: [
    'water', 'sparkling water', 'mineral water', 'juice', 'orange juice', 'apple juice',
    'coffee', 'cold brew', 'tea', 'green tea', 'kombucha', 'soda', 'coke', 'pepsi',
    'drink', 'beverage', 'drinks', 'smoothie', 'chai', 'filter coffee', 'paani', 'thanneer'
  ],
  'Personal Care': [
    'toothpaste', 'toothbrush', 'shampoo', 'conditioner', 'soap', 'body wash',
    'deodorant', 'lotion', 'face wash', 'sunscreen', 'dove', 'colgate', 'sensodyne',
    'shaving cream', 'razor', 'lip balm', 'moisturizer', 'oral care', 'hygiene'
  ],
  Household: [
    'paper towel', 'paper towels', 'toilet paper', 'tissue', 'tissues', 'detergent',
    'laundry detergent', 'dish soap', 'dishwasher pods', 'cleaning spray', 'cleaner',
    'trash bags', 'garbage bags', 'sponge', 'sponges', 'foil', 'ziploc', 'bounty',
    'charmin', 'tide', 'dawn', 'mrs meyers', 'cascade'
  ],
  Snacks: [
    'chip', 'chips', 'tortilla chips', 'potato chips', 'cracker', 'crackers', 'nuts',
    'almonds', 'pistachios', 'cashews', 'walnuts', 'chocolate', 'candy', 'granola bar',
    'granola', 'popcorn', 'biscuit', 'biscuits', 'cookies', 'namkeen', 'snack', 'snacks'
  ],
  Pantry: [
    'rice', 'jasmine rice', 'basmati', 'pasta', 'spaghetti', 'noodles', 'oil',
    'olive oil', 'cooking oil', 'sauce', 'marinara', 'flour', 'sugar', 'salt',
    'pepper', 'spices', 'oats', 'oatmeal', 'peanut butter', 'jam', 'honey',
    'canned beans', 'beans', 'lentils', 'dal', 'chawal', 'arisi'
  ],
  Other: []
};

export function inferCategory(productName: string): ProductCategory {
  const normalized = productName.toLowerCase().trim();

  for (const cat of CATEGORY_PRIORITY) {
    const keywords = CATEGORY_KEYWORD_MAP[cat];
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(normalized) || normalized.includes(kw)) {
        return cat;
      }
    }
  }

  return 'Other';
}
