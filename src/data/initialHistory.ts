import { PurchaseHistoryRecord } from '@/types/recommendation';

// Helper to get past ISO dates
const daysAgo = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

export const INITIAL_PURCHASE_HISTORY: PurchaseHistoryRecord[] = [
  {
    id: 'trip-1',
    date: daysAgo(6), // 6 days ago
    storeName: 'Whole Foods Market',
    totalSpent: 34.45,
    items: [
      {
        id: 'hist-1-1',
        name: 'Whole Vitamin D Milk',
        category: 'Dairy',
        quantity: 1,
        unit: 'carton',
        estimatedPrice: 4.89,
        purchased: true,
        addedAt: daysAgo(6)
      },
      {
        id: 'hist-1-2',
        name: 'Artisan Sourdough Loaf',
        category: 'Bakery',
        quantity: 1,
        unit: 'loaf',
        estimatedPrice: 4.99,
        purchased: true,
        addedAt: daysAgo(6)
      },
      {
        id: 'hist-1-3',
        name: 'Organic Bananas',
        category: 'Produce',
        quantity: 1,
        unit: 'bunch',
        estimatedPrice: 1.29,
        purchased: true,
        addedAt: daysAgo(6)
      },
      {
        id: 'hist-1-4',
        name: 'Large Brown Grade A Eggs',
        category: 'Dairy',
        quantity: 1,
        unit: 'carton',
        estimatedPrice: 5.79,
        purchased: true,
        addedAt: daysAgo(6)
      },
      {
        id: 'hist-1-5',
        name: 'Ultra Dishwashing Liquid Soap',
        category: 'Household',
        quantity: 1,
        unit: 'bottle',
        estimatedPrice: 3.29,
        purchased: true,
        addedAt: daysAgo(6)
      }
    ]
  },
  {
    id: 'trip-2',
    date: daysAgo(13), // 13 days ago (~7 days before trip 1)
    storeName: 'Trader Joe’s',
    totalSpent: 42.18,
    items: [
      {
        id: 'hist-2-1',
        name: 'Whole Vitamin D Milk',
        category: 'Dairy',
        quantity: 1,
        unit: 'carton',
        estimatedPrice: 4.89,
        purchased: true,
        addedAt: daysAgo(13)
      },
      {
        id: 'hist-2-2',
        name: 'Artisan Sourdough Loaf',
        category: 'Bakery',
        quantity: 1,
        unit: 'loaf',
        estimatedPrice: 4.99,
        purchased: true,
        addedAt: daysAgo(13)
      },
      {
        id: 'hist-2-3',
        name: 'Organic Honeycrisp Apples',
        category: 'Produce',
        quantity: 2,
        unit: 'lb',
        estimatedPrice: 7.98,
        purchased: true,
        addedAt: daysAgo(13)
      },
      {
        id: 'hist-2-4',
        name: 'Greek Whole Milk Plain Yogurt',
        category: 'Dairy',
        quantity: 2,
        unit: 'tub',
        estimatedPrice: 6.98,
        purchased: true,
        addedAt: daysAgo(13)
      },
      {
        id: 'hist-2-5',
        name: 'Sparkling Mineral Water (12 Pack)',
        category: 'Beverages',
        quantity: 1,
        unit: 'pack',
        estimatedPrice: 9.99,
        purchased: true,
        addedAt: daysAgo(13)
      }
    ]
  },
  {
    id: 'trip-3',
    date: daysAgo(20), // 20 days ago
    storeName: 'Whole Foods Market',
    totalSpent: 28.50,
    items: [
      {
        id: 'hist-3-1',
        name: 'Whole Vitamin D Milk',
        category: 'Dairy',
        quantity: 1,
        unit: 'carton',
        estimatedPrice: 4.89,
        purchased: true,
        addedAt: daysAgo(20)
      },
      {
        id: 'hist-3-2',
        name: 'Organic Bananas',
        category: 'Produce',
        quantity: 2,
        unit: 'bunch',
        estimatedPrice: 2.58,
        purchased: true,
        addedAt: daysAgo(20)
      },
      {
        id: 'hist-3-3',
        name: 'Baby Spinach',
        category: 'Produce',
        quantity: 1,
        unit: 'tub',
        estimatedPrice: 2.99,
        purchased: true,
        addedAt: daysAgo(20)
      },
      {
        id: 'hist-3-4',
        name: 'Organic Jasmine Long Grain Rice',
        category: 'Pantry',
        quantity: 1,
        unit: 'bag',
        estimatedPrice: 4.99,
        purchased: true,
        addedAt: daysAgo(20)
      }
    ]
  },
  {
    id: 'trip-4',
    date: daysAgo(27), // 27 days ago
    storeName: 'Local Market',
    totalSpent: 38.10,
    items: [
      {
        id: 'hist-4-1',
        name: 'Whole Vitamin D Milk',
        category: 'Dairy',
        quantity: 1,
        unit: 'carton',
        estimatedPrice: 4.89,
        purchased: true,
        addedAt: daysAgo(27)
      },
      {
        id: 'hist-4-2',
        name: 'Large Brown Grade A Eggs',
        category: 'Dairy',
        quantity: 1,
        unit: 'carton',
        estimatedPrice: 5.79,
        purchased: true,
        addedAt: daysAgo(27)
      },
      {
        id: 'hist-4-3',
        name: 'Deep Clean Daily Toothpaste',
        category: 'Personal Care',
        quantity: 1,
        unit: 'tube',
        estimatedPrice: 3.99,
        purchased: true,
        addedAt: daysAgo(27)
      }
    ]
  }
];
