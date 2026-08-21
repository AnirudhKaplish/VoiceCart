'use client';

import React from 'react';
import { X, Search, Mic } from 'lucide-react';
import { ProductCategory } from '@/types/shopping';
import { useProducts } from '@/context/ProductContext';
import { useVoice } from '@/context/VoiceContext';
import { CATEGORIES_META } from '@/lib/utils/categories';

export const FilterBar: React.FC = () => {
  const { filters, updateFilter, resetFilters } = useProducts();
  const { startListening } = useVoice();

  const hasActiveFilters =
    filters.query.trim() !== '' ||
    filters.category !== 'All' ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.brand !== undefined ||
    filters.inStockOnly;

  return (
    <div className="space-y-4 mb-6">
      {/* Search Input Bar with Voice Button */}
      <div className="relative flex items-center">
        <div className="absolute left-4 text-stone-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={filters.query}
          onChange={(e) => updateFilter({ query: e.target.value })}
          placeholder='Search catalog or say "Find organic apples under $5"...'
          className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-white border border-stone-200 text-stone-900 placeholder:text-stone-400 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {filters.query && (
            <button
              onClick={() => updateFilter({ query: '' })}
              className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={startListening}
            type="button"
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            title="Search by voice"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice Search</span>
          </button>
        </div>
      </div>

      {/* Active Voice Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 animate-fadeIn">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Active Filters:
          </span>

          {filters.query && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span>Query: &ldquo;{filters.query}&rdquo;</span>
              <button onClick={() => updateFilter({ query: '' })}>
                <X className="w-3 h-3 hover:text-emerald-950" />
              </button>
            </span>
          )}

          {filters.category !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
              <span>Category: {filters.category}</span>
              <button onClick={() => updateFilter({ category: 'All' })}>
                <X className="w-3 h-3 hover:text-blue-950" />
              </button>
            </span>
          )}

          {filters.maxPrice !== undefined && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
              <span>Max Price: ${filters.maxPrice}</span>
              <button onClick={() => updateFilter({ maxPrice: undefined })}>
                <X className="w-3 h-3 hover:text-amber-950" />
              </button>
            </span>
          )}

          {filters.minPrice !== undefined && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
              <span>Min Price: ${filters.minPrice}</span>
              <button onClick={() => updateFilter({ minPrice: undefined })}>
                <X className="w-3 h-3 hover:text-amber-950" />
              </button>
            </span>
          )}

          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
              <span>In Stock Only</span>
              <button onClick={() => updateFilter({ inStockOnly: false })}>
                <X className="w-3 h-3 hover:text-teal-950" />
              </button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
          >
            Reset all
          </button>
        </div>
      )}

      {/* Category Scrolling Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => updateFilter({ category: 'All' })}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
            filters.category === 'All'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          All Items
        </button>

        {Object.keys(CATEGORIES_META).map((catName) => {
          const cat = catName as ProductCategory;
          const isSelected = filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => updateFilter({ category: cat })}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{CATEGORIES_META[cat].emoji}</span>
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary quick toggles: In-Stock, Price Range buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        <label className="inline-flex items-center gap-2 text-stone-700 font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => updateFilter({ inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
          />
          <span>In Stock Only</span>
        </label>

        <div className="flex items-center gap-1 text-stone-500">
          <span>Quick Price:</span>
          <button
            onClick={() => updateFilter({ maxPrice: 5, minPrice: undefined })}
            className={`px-2 py-1 rounded-lg border text-xs font-medium cursor-pointer ${
              filters.maxPrice === 5 ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 hover:bg-stone-50'
            }`}
          >
            Under $5
          </button>
          <button
            onClick={() => updateFilter({ minPrice: 5, maxPrice: 10 })}
            className={`px-2 py-1 rounded-lg border text-xs font-medium cursor-pointer ${
              filters.minPrice === 5 && filters.maxPrice === 10 ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 hover:bg-stone-50'
            }`}
          >
            $5 – $10
          </button>
          <button
            onClick={() => updateFilter({ minPrice: 10, maxPrice: undefined })}
            className={`px-2 py-1 rounded-lg border text-xs font-medium cursor-pointer ${
              filters.minPrice === 10 ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 hover:bg-stone-50'
            }`}
          >
            Over $10
          </button>
        </div>
      </div>
    </div>
  );
};
