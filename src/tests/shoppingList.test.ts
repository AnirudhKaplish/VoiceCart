import { describe, it, expect } from 'vitest';
import { inferCategory } from '@/lib/utils/categories';
import { extractPriceFilter } from '@/lib/parser/entityExtractor';

describe('VoiceCart Category & Filter Utilities', () => {
  it('correctly categorizes various produce items', () => {
    expect(inferCategory('Honeycrisp Apples')).toBe('Produce');
    expect(inferCategory('Organic Bananas')).toBe('Produce');
    expect(inferCategory('Baby Spinach')).toBe('Produce');
    expect(inferCategory('Avocados')).toBe('Produce');
  });

  it('correctly categorizes dairy and alternatives', () => {
    expect(inferCategory('Whole Vitamin D Milk')).toBe('Dairy');
    expect(inferCategory('Almond Milk')).toBe('Dairy');
    expect(inferCategory('Greek Yogurt')).toBe('Dairy');
    expect(inferCategory('Pasture-Raised Eggs')).toBe('Dairy');
  });

  it('correctly categorizes bakery items', () => {
    expect(inferCategory('Artisan Sourdough Loaf')).toBe('Bakery');
    expect(inferCategory('Everything Bagels')).toBe('Bakery');
    expect(inferCategory('Butter Croissants')).toBe('Bakery');
  });

  it('correctly categorizes personal care and household items', () => {
    expect(inferCategory('Colgate Toothpaste')).toBe('Personal Care');
    expect(inferCategory('Dove Shampoo')).toBe('Personal Care');
    expect(inferCategory('Bounty Paper Towels')).toBe('Household');
    expect(inferCategory('Tide Laundry Detergent')).toBe('Household');
  });

  it('correctly extracts price ranges', () => {
    const underFive = extractPriceFilter('Find snacks under $5');
    expect(underFive.maxPrice).toBe(5);
    expect(underFive.extractedQuery).toBe('Find snacks');

    const between = extractPriceFilter('Find beverages between $2 and $8');
    expect(between.minPrice).toBe(2);
    expect(between.maxPrice).toBe(8);
    expect(between.extractedQuery).toBe('Find beverages');
  });
});
