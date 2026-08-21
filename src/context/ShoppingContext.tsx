'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ShoppingItem, UndoAction, ProductCategory } from '@/types/shopping';
import { ParsedItemEntity } from '@/types/voice';
import { getStoredItem, setStoredItem } from '@/lib/utils/storage';
import { inferCategory } from '@/lib/utils/categories';

interface ShoppingContextType {
  items: ShoppingItem[];
  addItem: (name: string, quantity?: number, unit?: string, category?: ProductCategory, estimatedPrice?: number, source?: ShoppingItem['source']) => ShoppingItem;
  addParsedEntities: (entities: ParsedItemEntity[], source?: ShoppingItem['source']) => ShoppingItem[];
  removeItem: (idOrName: string) => ShoppingItem | null;
  updateItemQuantity: (idOrName: string, quantity: number, unit?: string) => ShoppingItem | null;
  toggleItemPurchased: (id: string) => void;
  markItemPurchasedByName: (name: string) => ShoppingItem | null;
  clearList: () => void;
  undoLastAction: () => boolean;
  undoStack: UndoAction[];
  lastUndoAction: UndoAction | null;
  resetToSampleData: () => void;
  totalEstimatedCost: number;
  purchasedCount: number;
  unpurchasedCount: number;
}

const STORAGE_KEY = 'voicecart_shopping_items';
const UNDO_STORAGE_KEY = 'voicecart_undo_stack';

const INITIAL_SAMPLE_ITEMS: ShoppingItem[] = [
  {
    id: 'init-1',
    name: 'Organic Honeycrisp Apples',
    category: 'Produce',
    quantity: 2,
    unit: 'lb',
    estimatedPrice: 7.98,
    purchased: false,
    addedAt: new Date().toISOString(),
    source: 'voice'
  },
  {
    id: 'init-2',
    name: 'Extra Creamy Oat Milk',
    category: 'Dairy',
    quantity: 1,
    unit: 'carton',
    estimatedPrice: 4.99,
    purchased: false,
    addedAt: new Date().toISOString(),
    source: 'recommendation'
  },
  {
    id: 'init-3',
    name: 'Artisan Sourdough Loaf',
    category: 'Bakery',
    quantity: 1,
    unit: 'loaf',
    estimatedPrice: 4.99,
    purchased: true,
    addedAt: new Date().toISOString(),
    source: 'manual'
  }
];

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export const ShoppingProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ShoppingItem[]>(() => 
    getStoredItem<ShoppingItem[]>(STORAGE_KEY, INITIAL_SAMPLE_ITEMS)
  );
  const [undoStack, setUndoStack] = useState<UndoAction[]>(() => 
    getStoredItem<UndoAction[]>(UNDO_STORAGE_KEY, [])
  );
  const [lastUndoAction, setLastUndoAction] = useState<UndoAction | null>(null);

  // Sync items to LocalStorage
  useEffect(() => {
    setStoredItem(STORAGE_KEY, items);
  }, [items]);

  // Sync undoStack to LocalStorage
  useEffect(() => {
    setStoredItem(UNDO_STORAGE_KEY, undoStack);
  }, [undoStack]);

  const pushUndoAction = useCallback((action: UndoAction) => {
    setUndoStack(prev => [action, ...prev.slice(0, 19)]);
    setLastUndoAction(action);
  }, []);

  const addItem = useCallback((
    name: string,
    quantity: number = 1,
    unit?: string,
    category?: ProductCategory,
    estimatedPrice?: number,
    source: ShoppingItem['source'] = 'manual'
  ): ShoppingItem => {
    const resolvedCategory = category || inferCategory(name);
    const newItem: ShoppingItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: name.trim(),
      category: resolvedCategory,
      quantity: Math.max(0.1, quantity),
      unit,
      estimatedPrice,
      purchased: false,
      addedAt: new Date().toISOString(),
      source
    };

    setItems(prev => {
      const existingIdx = prev.findIndex(
        i => !i.purchased && i.name.toLowerCase() === newItem.name.toLowerCase()
      );

      let updatedList: ShoppingItem[];
      if (existingIdx >= 0) {
        updatedList = [...prev];
        updatedList[existingIdx] = {
          ...updatedList[existingIdx],
          quantity: updatedList[existingIdx].quantity + newItem.quantity,
          unit: newItem.unit || updatedList[existingIdx].unit
        };
      } else {
        updatedList = [newItem, ...prev];
      }

      pushUndoAction({
        id: `undo-${Date.now()}`,
        type: 'ADD_ITEM',
        description: `Added "${newItem.name}"`,
        timestamp: Date.now(),
        previousItems: prev,
        itemsAffected: [newItem]
      });

      return updatedList;
    });

    return newItem;
  }, [pushUndoAction]);

  const addParsedEntities = useCallback((entities: ParsedItemEntity[], source: ShoppingItem['source'] = 'voice'): ShoppingItem[] => {
    const newItems: ShoppingItem[] = [];

    setItems(prev => {
      let currentList = [...prev];

      entities.forEach(entity => {
        const itemCategory = entity.category || inferCategory(entity.name);
        const newItem: ShoppingItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: entity.name,
          category: itemCategory,
          quantity: entity.quantity,
          unit: entity.unit,
          purchased: false,
          addedAt: new Date().toISOString(),
          source
        };

        const existingIdx = currentList.findIndex(
          i => !i.purchased && i.name.toLowerCase() === newItem.name.toLowerCase()
        );

        if (existingIdx >= 0) {
          currentList[existingIdx] = {
            ...currentList[existingIdx],
            quantity: currentList[existingIdx].quantity + newItem.quantity,
            unit: newItem.unit || currentList[existingIdx].unit
          };
          newItems.push(currentList[existingIdx]);
        } else {
          currentList = [newItem, ...currentList];
          newItems.push(newItem);
        }
      });

      pushUndoAction({
        id: `undo-${Date.now()}`,
        type: entities.length > 1 ? 'BULK_ADD' : 'ADD_ITEM',
        description: entities.length > 1 ? `Added ${entities.length} items` : `Added "${entities[0].name}"`,
        timestamp: Date.now(),
        previousItems: prev,
        itemsAffected: newItems
      });

      return currentList;
    });

    return newItems;
  }, [pushUndoAction]);

  const removeItem = useCallback((idOrName: string): ShoppingItem | null => {
    let removedItem: ShoppingItem | null = null;

    setItems(prev => {
      const idx = prev.findIndex(
        i => i.id === idOrName || i.name.toLowerCase() === idOrName.toLowerCase()
      );

      if (idx === -1) return prev;

      removedItem = prev[idx];
      const updated = prev.filter((_, i) => i !== idx);

      pushUndoAction({
        id: `undo-${Date.now()}`,
        type: 'REMOVE_ITEM',
        description: `Removed "${removedItem.name}"`,
        timestamp: Date.now(),
        previousItems: prev,
        itemsAffected: [removedItem]
      });

      return updated;
    });

    return removedItem;
  }, [pushUndoAction]);

  const updateItemQuantity = useCallback((idOrName: string, quantity: number, unit?: string): ShoppingItem | null => {
    let updatedItem: ShoppingItem | null = null;

    setItems(prev => {
      const idx = prev.findIndex(
        i => i.id === idOrName || i.name.toLowerCase().includes(idOrName.toLowerCase())
      );

      if (idx === -1) return prev;

      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        quantity: Math.max(0.1, quantity),
        unit: unit !== undefined ? unit : updated[idx].unit
      };
      updatedItem = updated[idx];

      pushUndoAction({
        id: `undo-${Date.now()}`,
        type: 'UPDATE_ITEM',
        description: `Updated quantity for "${updatedItem.name}"`,
        timestamp: Date.now(),
        previousItems: prev,
        itemsAffected: [updatedItem]
      });

      return updated;
    });

    return updatedItem;
  }, [pushUndoAction]);

  const toggleItemPurchased = useCallback((id: string) => {
    setItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          return { ...item, purchased: !item.purchased };
        }
        return item;
      });

      const toggled = prev.find(i => i.id === id);
      if (toggled) {
        pushUndoAction({
          id: `undo-${Date.now()}`,
          type: 'MARK_PURCHASED',
          description: toggled.purchased ? `Unmarked "${toggled.name}"` : `Purchased "${toggled.name}"`,
          timestamp: Date.now(),
          previousItems: prev
        });
      }

      return updated;
    });
  }, [pushUndoAction]);

  const markItemPurchasedByName = useCallback((name: string): ShoppingItem | null => {
    let found: ShoppingItem | null = null;
    setItems(prev => {
      const idx = prev.findIndex(i => i.name.toLowerCase().includes(name.toLowerCase()));
      if (idx === -1) return prev;

      const updated = [...prev];
      updated[idx] = { ...updated[idx], purchased: true };
      found = updated[idx];

      pushUndoAction({
        id: `undo-${Date.now()}`,
        type: 'MARK_PURCHASED',
        description: `Marked "${found.name}" as bought`,
        timestamp: Date.now(),
        previousItems: prev,
        itemsAffected: [found]
      });

      return updated;
    });
    return found;
  }, [pushUndoAction]);

  const clearList = useCallback(() => {
    setItems(prev => {
      if (prev.length === 0) return prev;
      pushUndoAction({
        id: `undo-${Date.now()}`,
        type: 'CLEAR_LIST',
        description: 'Cleared all items',
        timestamp: Date.now(),
        previousItems: prev
      });
      return [];
    });
  }, [pushUndoAction]);

  const undoLastAction = useCallback((): boolean => {
    if (undoStack.length === 0) return false;

    const [latest, ...remainingStack] = undoStack;
    setItems(latest.previousItems);
    setUndoStack(remainingStack);
    setLastUndoAction(remainingStack[0] || null);
    return true;
  }, [undoStack]);

  const resetToSampleData = useCallback(() => {
    setItems(INITIAL_SAMPLE_ITEMS);
    setUndoStack([]);
    setLastUndoAction(null);
  }, []);

  const totalEstimatedCost = items.reduce((sum, item) => {
    return sum + (item.estimatedPrice ? item.estimatedPrice * (item.quantity || 1) : 0);
  }, 0);

  const purchasedCount = items.filter(i => i.purchased).length;
  const unpurchasedCount = items.filter(i => !i.purchased).length;

  return (
    <ShoppingContext.Provider
      value={{
        items,
        addItem,
        addParsedEntities,
        removeItem,
        updateItemQuantity,
        toggleItemPurchased,
        markItemPurchasedByName,
        clearList,
        undoLastAction,
        undoStack,
        lastUndoAction,
        resetToSampleData,
        totalEstimatedCost,
        purchasedCount,
        unpurchasedCount
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};

export const useShopping = () => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShopping must be used within a ShoppingProvider');
  }
  return context;
};
