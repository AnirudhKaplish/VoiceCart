import { describe, it, expect } from 'vitest';
import { generateSmartRecommendations, calculatePurchaseStats } from '@/lib/recommendations/recommendationEngine';
import { INITIAL_PURCHASE_HISTORY } from '@/data/initialHistory';
import { MOCK_PRODUCTS } from '@/data/products';
import { ShoppingItem } from '@/types/shopping';

describe('VoiceCart Smart Recommendation Engine', () => {
  it('calculates historical purchase frequency accurately', () => {
    const stats = calculatePurchaseStats(INITIAL_PURCHASE_HISTORY);
    expect(stats.has('whole vitamin d milk')).toBe(true);

    const milkStat = stats.get('whole vitamin d milk');
    expect(milkStat?.totalTimesBought).toBe(4);
    expect(milkStat?.averageIntervalDays).toBe(7);
  });

  it('generates replenishment recommendations based on past purchase intervals', () => {
    const currentItems: ShoppingItem[] = [];
    const recs = generateSmartRecommendations(currentItems, INITIAL_PURCHASE_HISTORY, MOCK_PRODUCTS);

    expect(recs.length).toBeGreaterThan(0);
    // Should have a replenishment recommendation for milk or bananas
    const hasReplenishment = recs.some(r => r.reasonType === 'REPLENISHMENT');
    expect(hasReplenishment).toBe(true);
  });

  it('suggests out-of-stock substitutions when out of stock item is in list', () => {
    const currentItems: ShoppingItem[] = [
      {
        id: '1',
        name: 'Whole Vitamin D Milk', // Out of stock in MOCK_PRODUCTS
        category: 'Dairy',
        quantity: 1,
        purchased: false,
        addedAt: new Date().toISOString()
      }
    ];

    const recs = generateSmartRecommendations(currentItems, INITIAL_PURCHASE_HISTORY, MOCK_PRODUCTS);
    const subRec = recs.find(r => r.reasonType === 'SUBSTITUTE');

    expect(subRec).toBeDefined();
    expect(subRec?.originalProductName).toBe('Whole Vitamin D Milk');
    expect(subRec?.product.name).toMatch(/Almond Milk|Oat Milk/);
  });

  it('suggests seasonal favorites', () => {
    const recs = generateSmartRecommendations([], [], MOCK_PRODUCTS);
    const seasonalRec = recs.find(r => r.reasonType === 'SEASONAL');

    expect(seasonalRec).toBeDefined();
    expect(seasonalRec?.badgeText).toBe('Seasonal Pick');
  });
});
