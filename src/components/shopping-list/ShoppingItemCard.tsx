'use client';

import React from 'react';
import { Check, Plus, Minus, Trash2, Mic } from 'lucide-react';
import { ShoppingItem } from '@/types/shopping';
import { useShopping } from '@/context/ShoppingContext';
import { CATEGORIES_META } from '@/lib/utils/categories';

interface ShoppingItemCardProps {
  item: ShoppingItem;
}

export const ShoppingItemCard: React.FC<ShoppingItemCardProps> = ({ item }) => {
  const { toggleItemPurchased, updateItemQuantity, removeItem } = useShopping();
  const meta = CATEGORIES_META[item.category] || CATEGORIES_META.Other;

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateItemQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.quantity > 1) {
      updateItemQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  return (
    <div
      onClick={() => toggleItemPurchased(item.id)}
      className={`group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
        item.purchased
          ? 'bg-stone-50/60 border-stone-200/60 opacity-60'
          : 'bg-white border-stone-200 shadow-sm hover:border-emerald-300 hover:shadow'
      }`}
    >
      {/* Checkbox & Product Info */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleItemPurchased(item.id);
          }}
          aria-label={`Mark ${item.name} as ${item.purchased ? 'uncompleted' : 'purchased'}`}
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
            item.purchased
              ? 'bg-emerald-600 text-white'
              : 'border-2 border-stone-300 hover:border-emerald-500 bg-white'
          }`}
        >
          {item.purchased && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base">{meta.emoji}</span>
            <span
              className={`font-semibold text-sm sm:text-base truncate transition-colors ${
                item.purchased ? 'line-through text-stone-400 font-normal' : 'text-stone-900'
              }`}
            >
              {item.name}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500">
            <span className="font-medium text-stone-600">
              {item.quantity} {item.unit || 'unit(s)'}
            </span>

            {item.estimatedPrice && (
              <>
                <span>•</span>
                <span>${(item.estimatedPrice * item.quantity).toFixed(2)}</span>
              </>
            )}

            {item.source === 'voice' && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                <Mic className="w-2.5 h-2.5" />
                <span>Voice</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stepper Controls & Delete */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200/60"
        >
          <button
            type="button"
            onClick={handleDecrement}
            className="p-1 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-white transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="px-2 text-xs font-bold text-stone-800 min-w-[1.5rem] text-center">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            className="p-1 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-white transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeItem(item.id);
          }}
          className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
