'use client';

import React from 'react';
import { X, Sparkles, Plus, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { useShopping } from '@/context/ShoppingContext';
import { useProducts } from '@/context/ProductContext';

interface SubstituteModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SubstituteModal: React.FC<SubstituteModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const { addItem, items } = useShopping();
  const { products } = useProducts();

  if (!isOpen || !product) return null;

  const substitutes = (product.substituteProductIds || [])
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close substitutes modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Smart Substitutes</span>
        </div>

        <h3 className="text-xl font-bold text-stone-900">
          Alternatives for {product.name}
        </h3>
        <p className="text-xs text-stone-500 mt-1 mb-5">
          {product.inStock
            ? 'Popular dietary and brand alternatives'
            : 'This item is currently out of stock. Try these verified alternatives:'}
        </p>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {substitutes.length === 0 ? (
            <p className="text-sm text-stone-500 py-4 text-center">
              No specific substitutes found in this category.
            </p>
          ) : (
            substitutes.map(sub => {
              const inList = items.some(i => i.name.toLowerCase() === sub.name.toLowerCase() && !i.purchased);

              return (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-3xl p-2 rounded-xl bg-white border border-stone-200 shrink-0">
                      {sub.emoji}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-stone-900 truncate">
                        {sub.name}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {sub.brand} • ${sub.price.toFixed(2)} • {sub.size}
                      </p>
                      {sub.tags && (
                        <div className="flex gap-1 mt-1">
                          {sub.tags.slice(0, 2).map(t => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white text-stone-600 border border-stone-200">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addItem(sub.name, 1, sub.unit, sub.category, sub.price, 'recommendation');
                    }}
                    disabled={inList}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 ${
                      inList
                        ? 'bg-stone-200 text-stone-500'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    }`}
                  >
                    {inList ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{inList ? 'In List' : 'Add'}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
