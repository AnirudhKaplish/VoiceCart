'use client';

import React, { useState } from 'react';
import { Plus, Check, Info, Sparkles, AlertCircle, Calendar, RefreshCw } from 'lucide-react';
import { SmartRecommendation } from '@/types/recommendation';
import { useShopping } from '@/context/ShoppingContext';

interface SuggestionCardProps {
  recommendation: SmartRecommendation;
  onDismiss?: (id: string) => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  recommendation
}) => {
  const { addItem, items } = useShopping();
  const [added, setAdded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const { product, reasonType, headline, explanation, badgeText, originalProductName } = recommendation;

  const isAlreadyInList = items.some(
    i => i.name.toLowerCase() === product.name.toLowerCase() && !i.purchased
  );

  const handleAdd = () => {
    addItem(product.name, 1, product.unit, product.category, product.price, 'recommendation');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const getBadgeColor = () => {
    switch (reasonType) {
      case 'REPLENISHMENT':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'SUBSTITUTE':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'SEASONAL':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'POPULAR':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  const getReasonIcon = () => {
    switch (reasonType) {
      case 'REPLENISHMENT':
        return <RefreshCw className="w-3 h-3 text-emerald-700" />;
      case 'SUBSTITUTE':
        return <AlertCircle className="w-3 h-3 text-amber-700" />;
      case 'SEASONAL':
        return <Calendar className="w-3 h-3 text-purple-700" />;
      default:
        return <Sparkles className="w-3 h-3 text-blue-700" />;
    }
  };

  return (
    <div className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getBadgeColor()}`}>
            {getReasonIcon()}
            <span>{badgeText}</span>
          </span>

          <button
            onClick={() => setShowInfo(!showInfo)}
            aria-label="Toggle recommendation explanation"
            className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition-colors"
            title="Why recommended?"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Visual & Headline */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-center text-2xl shrink-0">
            {product.emoji || '🛒'}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-stone-900 text-sm leading-snug truncate">
              {product.name}
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              {product.brand} • ${product.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Headline & Context */}
        <p className="mt-2.5 text-xs text-stone-700 font-medium leading-relaxed">
          {headline}
        </p>

        {/* Expandable "Why?" Contextual Explanation */}
        {showInfo && (
          <div className="mt-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-[11px] text-stone-600 animate-fadeIn">
            <span className="font-semibold text-stone-800">Why recommended: </span>
            {explanation}
            {originalProductName && (
              <span className="block mt-1 text-amber-700 font-medium">
                (Replacement for {originalProductName})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[11px] text-stone-400 font-medium">
          {product.size}
        </span>

        <button
          onClick={handleAdd}
          disabled={isAlreadyInList || added}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
            isAlreadyInList
              ? 'bg-stone-100 text-stone-400 cursor-default'
              : added
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 hover:border-emerald-600'
          }`}
        >
          {isAlreadyInList ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>In List</span>
            </>
          ) : added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
