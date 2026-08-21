'use client';

import React, { useState, useMemo } from 'react';
import { ShoppingBag, Sparkles, Plus, Trash2, RotateCcw } from 'lucide-react';
import { ProductCategory, ShoppingItem } from '@/types/shopping';
import { useShopping } from '@/context/ShoppingContext';
import { useVoice } from '@/context/VoiceContext';
import { CATEGORIES_META } from '@/lib/utils/categories';
import { ShoppingItemCard } from './ShoppingItemCard';
import { AddItemModal } from './AddItemModal';

interface ShoppingListViewProps {
  maxCategoriesPreview?: number;
  showFilters?: boolean;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  maxCategoriesPreview,
  showFilters = true
}) => {
  const { items, clearList, undoLastAction, undoStack, purchasedCount, unpurchasedCount, totalEstimatedCost } = useShopping();
  const { startListening } = useVoice();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Group items by category
  const groupedItems = useMemo(() => {
    const map = new Map<ProductCategory, ShoppingItem[]>();

    items.forEach(item => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return;
      }
      const existing = map.get(item.category) || [];
      existing.push(item);
      map.set(item.category, existing);
    });

    return Array.from(map.entries());
  }, [items, selectedCategory]);

  const totalItems = items.length;
  const progressPercent = totalItems > 0 ? Math.round((purchasedCount / totalItems) * 100) : 0;

  const displayedGroups = maxCategoriesPreview
    ? groupedItems.slice(0, maxCategoriesPreview)
    : groupedItems;

  return (
    <section className="my-6">
      {/* Header & List Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-stone-900 text-xl sm:text-2xl">Your Shopping List</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {unpurchasedCount} to buy
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {totalItems} total items across {groupedItems.length} categories
            {totalEstimatedCost > 0 && ` • ~$${totalEstimatedCost.toFixed(2)} estimated`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {undoStack.length > 0 && (
            <button
              onClick={() => undoLastAction()}
              type="button"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Undo last action"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Undo</span>
            </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            type="button"
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>

          {totalItems > 0 && (
            <button
              onClick={clearList}
              type="button"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white border border-stone-200 hover:bg-rose-50 hover:text-rose-600 text-stone-600 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Clear entire list"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar if items exist */}
      {totalItems > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-stone-600 mb-2">
            <span>Shopping Progress</span>
            <span className="font-bold text-stone-900">{purchasedCount} of {totalItems} items ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Category Pills (Filters) */}
      {showFilters && totalItems > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-5 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            All Categories ({totalItems})
          </button>

          {Object.keys(CATEGORIES_META).map((catName) => {
            const cat = catName as ProductCategory;
            const count = items.filter(i => i.category === cat).length;
            if (count === 0) return null;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>{CATEGORIES_META[cat].emoji}</span>
                <span>{cat}</span>
                <span className="opacity-70 font-normal">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {totalItems === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-white border border-stone-200/80 shadow-sm my-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-3">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">Your shopping list is empty</h3>
          <p className="text-stone-500 text-sm max-w-sm mx-auto mt-1 mb-5">
            Tell VoiceCart what you need! Just tap the microphone and say what to add.
          </p>
          <button
            onClick={startListening}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tell VoiceCart What You Need</span>
          </button>
        </div>
      ) : (
        /* Categorized Item Sections */
        <div className="space-y-6">
          {displayedGroups.map(([category, catItems]) => {
            const meta = CATEGORIES_META[category] || CATEGORIES_META.Other;
            return (
              <div key={category} className="space-y-2.5">
                <div className="flex items-center gap-2 px-1">
                  <span className="text-lg">{meta.emoji}</span>
                  <h3 className="font-bold text-stone-800 text-sm tracking-wide uppercase">
                    {category}
                  </h3>
                  <span className="text-xs font-semibold text-stone-400">
                    ({catItems.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {catItems.map((item) => (
                    <ShoppingItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </section>
  );
};
