'use client';

import React, { useState } from 'react';
import { Plus, Check, Star, AlertCircle, RefreshCw } from 'lucide-react';
import { Product } from '@/types/product';
import { useShopping } from '@/context/ShoppingContext';
import { CATEGORIES_META } from '@/lib/utils/categories';
import { SubstituteModal } from '../suggestions/SubstituteModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items } = useShopping();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const isInList = items.some(
    i => i.name.toLowerCase() === product.name.toLowerCase() && !i.purchased
  );

  const categoryMeta = CATEGORIES_META[product.category] || CATEGORIES_META.Other;

  const handleAdd = () => {
    if (!product.inStock) {
      setIsSubModalOpen(true);
      return;
    }
    addItem(product.name, 1, product.unit, product.category, product.price, 'manual');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <div className="group relative flex flex-col justify-between p-4 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200">
        <div>
          {/* Top Category Badge & Stock Status */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${categoryMeta.badgeBg}`}>
              <span>{categoryMeta.emoji}</span>
              <span>{product.category}</span>
            </span>

            {!product.inStock ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <AlertCircle className="w-3 h-3" />
                <span>Out of Stock</span>
              </span>
            ) : product.seasonal ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Seasonal
              </span>
            ) : null}
          </div>

          {/* Product Icon & Headline */}
          <div className="flex items-start gap-3 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
              {product.emoji || '🛒'}
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                {product.brand} • {product.size}
              </p>
            </div>
          </div>

          {/* Tags & Rating */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-xs">
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating || 4.7}</span>
            </div>

            <div className="flex flex-wrap gap-1 justify-end">
              {product.tags.slice(0, 2).map((t, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Price & Add / Substitute Button */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-base font-extrabold text-stone-900">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-[11px] text-stone-400 font-medium block">
              /${product.unit}
            </span>
          </div>

          {!product.inStock ? (
            <button
              onClick={() => setIsSubModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-amber-700" />
              <span>Find Alt</span>
            </button>
          ) : (
            <button
              onClick={handleAdd}
              disabled={isInList || added}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isInList
                  ? 'bg-stone-100 text-stone-400 cursor-default'
                  : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 hover:border-emerald-600'
              }`}
            >
              {isInList ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>In List</span>
                </>
              ) : added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to List</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <SubstituteModal
        product={product}
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
      />
    </>
  );
};
