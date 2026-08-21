'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { Product, ProductFilterState } from '@/types/product';
import { SmartRecommendation, PurchaseHistoryRecord } from '@/types/recommendation';
import { MOCK_PRODUCTS } from '@/data/products';
import { INITIAL_PURCHASE_HISTORY } from '@/data/initialHistory';
import { generateSmartRecommendations } from '@/lib/recommendations/recommendationEngine';
import { useShopping } from './ShoppingContext';
import { getStoredItem, setStoredItem } from '@/lib/utils/storage';

interface ProductContextType {
  products: Product[];
  history: PurchaseHistoryRecord[];
  recommendations: SmartRecommendation[];
  dismissRecommendation: (recId: string) => void;
  filters: ProductFilterState;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilterState>>;
  updateFilter: (partial: Partial<ProductFilterState>) => void;
  resetFilters: () => void;
  filteredProducts: Product[];
  addHistoryTripToList: (tripId: string) => number;
  addCompletedSessionToHistory: () => void;
  resetHistoryToDefault: () => void;
}

const HISTORY_STORAGE_KEY = 'voicecart_purchase_history';

const INITIAL_FILTERS: ProductFilterState = {
  query: '',
  category: 'All',
  inStockOnly: false,
  tags: []
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const { items, addItem } = useShopping();
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [history, setHistory] = useState<PurchaseHistoryRecord[]>(() =>
    getStoredItem<PurchaseHistoryRecord[]>(HISTORY_STORAGE_KEY, INITIAL_PURCHASE_HISTORY)
  );
  const [dismissedRecIds, setDismissedRecIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProductFilterState>(INITIAL_FILTERS);

  // Save history on changes
  useEffect(() => {
    setStoredItem(HISTORY_STORAGE_KEY, history);
  }, [history]);

  // Compute smart recommendations reactively
  const recommendations = useMemo(() => {
    const all = generateSmartRecommendations(items, history, products);
    return all.filter(r => !dismissedRecIds.includes(r.id));
  }, [items, history, products, dismissedRecIds]);

  const dismissRecommendation = useCallback((recId: string) => {
    setDismissedRecIds(prev => [...prev, recId]);
  }, []);

  const updateFilter = useCallback((partial: Partial<ProductFilterState>) => {
    setFilters(prev => ({ ...prev, ...partial }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // Filter products based on search term, category, brand, price range, stock
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (filters.category !== 'All' && product.category !== filters.category) {
        return false;
      }

      // Brand filter
      if (filters.brand && product.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }

      // In stock filter
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      // Price filter
      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false;
      }

      // Query search (matches name, brand, tags, category)
      if (filters.query.trim()) {
        const q = filters.query.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesTag = product.tags.some(t => t.toLowerCase().includes(q));

        if (!matchesName && !matchesBrand && !matchesCat && !matchesTag) {
          return false;
        }
      }

      return true;
    });
  }, [products, filters]);

  const addHistoryTripToList = useCallback((tripId: string): number => {
    const trip = history.find(t => t.id === tripId);
    if (!trip) return 0;

    trip.items.forEach(item => {
      addItem(item.name, item.quantity, item.unit, item.category, item.estimatedPrice, 'reorder');
    });

    return trip.items.length;
  }, [history, addItem]);

  const addCompletedSessionToHistory = useCallback(() => {
    const purchasedItems = items.filter(i => i.purchased);
    if (purchasedItems.length === 0) return;

    const total = purchasedItems.reduce((acc, i) => acc + (i.estimatedPrice || 3.99) * i.quantity, 0);

    const newTrip: PurchaseHistoryRecord = {
      id: `trip-${Date.now()}`,
      date: new Date().toISOString(),
      storeName: 'VoiceCart Grocery',
      totalSpent: parseFloat(total.toFixed(2)),
      items: purchasedItems
    };

    setHistory(prev => [newTrip, ...prev]);
  }, [items]);

  const resetHistoryToDefault = useCallback(() => {
    setHistory(INITIAL_PURCHASE_HISTORY);
    setDismissedRecIds([]);
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        history,
        recommendations,
        dismissRecommendation,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        filteredProducts,
        addHistoryTripToList,
        addCompletedSessionToHistory,
        resetHistoryToDefault
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
