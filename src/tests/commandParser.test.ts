import { describe, it, expect } from 'vitest';
import { parseNaturalCommand } from '@/lib/parser/commandParser';

describe('VoiceCart NLP Command Parser', () => {
  describe('Single Item ADD Commands', () => {
    it('parses simple add "Add milk"', () => {
      const res = parseNaturalCommand('Add milk');
      expect(res.action).toBe('ADD_ITEM');
      expect(res.items.length).toBe(1);
      expect(res.items[0].name).toBe('Milk');
      expect(res.items[0].quantity).toBe(1);
      expect(res.items[0].category).toBe('Dairy');
    });

    it('parses "I need apples"', () => {
      const res = parseNaturalCommand('I need apples');
      expect(res.action).toBe('ADD_ITEM');
      expect(res.items[0].name).toBe('Apples');
      expect(res.items[0].category).toBe('Produce');
    });

    it('parses "Add 2 bottles of water"', () => {
      const res = parseNaturalCommand('Add 2 bottles of water');
      expect(res.action).toBe('ADD_ITEM');
      expect(res.items[0].name).toBe('Water');
      expect(res.items[0].quantity).toBe(2);
      expect(res.items[0].unit).toBe('bottles');
      expect(res.items[0].category).toBe('Beverages');
    });

    it('parses "Buy 5 oranges"', () => {
      const res = parseNaturalCommand('Buy 5 oranges');
      expect(res.action).toBe('ADD_ITEM');
      expect(res.items[0].name).toBe('Oranges');
      expect(res.items[0].quantity).toBe(5);
      expect(res.items[0].category).toBe('Produce');
    });

    it('parses "Put bananas on my list"', () => {
      const res = parseNaturalCommand('Put bananas on my list');
      expect(res.action).toBe('ADD_ITEM');
      expect(res.items[0].name).toBe('Bananas');
      expect(res.items[0].category).toBe('Produce');
    });
  });

  describe('Multi-Item ADD Commands', () => {
    it('parses multi-item "Add 2 apples, 1 kg rice and 3 bottles of water"', () => {
      const res = parseNaturalCommand('Add 2 apples, 1 kg rice and 3 bottles of water');
      expect(res.action).toBe('ADD_ITEM');
      expect(res.items.length).toBe(3);

      expect(res.items[0].name).toBe('Apples');
      expect(res.items[0].quantity).toBe(2);
      expect(res.items[0].category).toBe('Produce');

      expect(res.items[1].name).toBe('Rice');
      expect(res.items[1].quantity).toBe(1);
      expect(res.items[1].unit).toBe('kg');
      expect(res.items[1].category).toBe('Pantry');

      expect(res.items[2].name).toBe('Water');
      expect(res.items[2].quantity).toBe(3);
      expect(res.items[2].unit).toBe('bottles');
      expect(res.items[2].category).toBe('Beverages');
    });

    it('parses "Add milk, 2 apples and a packet of bread"', () => {
      const res = parseNaturalCommand('Add milk, 2 apples and a packet of bread');
      expect(res.action).toBe('ADD_ITEM');
      expect(res.items.length).toBe(3);

      expect(res.items[0].name).toBe('Milk');
      expect(res.items[0].quantity).toBe(1);

      expect(res.items[1].name).toBe('Apples');
      expect(res.items[1].quantity).toBe(2);

      expect(res.items[2].name).toBe('Bread');
      expect(res.items[2].quantity).toBe(1);
      expect(res.items[2].unit).toBe('packet');
      expect(res.items[2].category).toBe('Bakery');
    });
  });

  describe('REMOVE, UPDATE & MARK PURCHASED Commands', () => {
    it('parses remove "Remove milk"', () => {
      const res = parseNaturalCommand('Remove milk');
      expect(res.action).toBe('REMOVE_ITEM');
      expect(res.items[0].name).toBe('Milk');
    });

    it('parses update "Change apples to 5"', () => {
      const res = parseNaturalCommand('Change apples to 5');
      expect(res.action).toBe('UPDATE_ITEM');
      expect(res.items[0].name).toBe('Apples');
      expect(res.items[0].quantity).toBe(5);
    });

    it('parses mark purchased "Mark bread as bought"', () => {
      const res = parseNaturalCommand('Mark bread as bought');
      expect(res.action).toBe('MARK_PURCHASED');
      expect(res.items[0].name).toBe('Bread');
    });
  });

  describe('Voice Search & Price Filter Commands', () => {
    it('parses "Find organic apples"', () => {
      const res = parseNaturalCommand('Find organic apples');
      expect(res.action).toBe('SEARCH_PRODUCT');
      expect(res.searchQuery?.toLowerCase()).toContain('apples');
    });

    it('parses "Find toothpaste under $5"', () => {
      const res = parseNaturalCommand('Find toothpaste under $5');
      expect(res.action).toBe('SEARCH_PRODUCT');
      expect(res.searchQuery?.toLowerCase()).toBe('toothpaste');
      expect(res.maxPrice).toBe(5);
    });

    it('parses "Find milk between $2 and $5"', () => {
      const res = parseNaturalCommand('Find milk between $2 and $5');
      expect(res.action).toBe('SEARCH_PRODUCT');
      expect(res.minPrice).toBe(2);
      expect(res.maxPrice).toBe(5);
    });

    it('parses "Show dairy products"', () => {
      const res = parseNaturalCommand('Show dairy products');
      expect(res.action).toBe('SEARCH_PRODUCT');
      expect(res.categoryFilter).toBe('Dairy');
    });
  });

  describe('Navigation & Utility Commands', () => {
    it('parses "What\'s on my list?"', () => {
      const res = parseNaturalCommand("What's on my list?");
      expect(res.action).toBe('SHOW_LIST');
    });

    it('parses "Clear list"', () => {
      const res = parseNaturalCommand('Clear list');
      expect(res.action).toBe('CLEAR_LIST');
    });

    it('parses "Undo last action"', () => {
      const res = parseNaturalCommand('Undo last action');
      expect(res.action).toBe('UNDO');
    });
  });

  describe('Multilingual Commands', () => {
    it('parses Hindi phrase "doodh add karo"', () => {
      const res = parseNaturalCommand('doodh add karo', 'hi-IN');
      expect(res.action).toBe('ADD_ITEM');
      expect(res.items[0].category).toBe('Dairy');
    });

    it('parses Tamil phrase "paal serkavum"', () => {
      const res = parseNaturalCommand('paal serkavum', 'ta-IN');
      expect(res.action).toBe('ADD_ITEM');
      expect(res.items[0].category).toBe('Dairy');
    });
  });
});
