'use client';

import React from 'react';
import { PackageSearch, Mic } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useVoice } from '@/context/VoiceContext';
import { ProductCard } from './ProductCard';
import { FilterBar } from './FilterBar';

export const ProductCatalog: React.FC = () => {
  const { filteredProducts, resetFilters } = useProducts();
  const { startListening } = useVoice();

  return (
    <div className="my-6">
      <FilterBar />

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-stone-800 text-sm tracking-wide uppercase">
          Matching Products ({filteredProducts.length})
        </h2>
      </div>

      {/* Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="p-10 text-center rounded-3xl bg-white border border-stone-200 shadow-sm my-6">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-3">
            <PackageSearch className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No products matched your request</h3>
          <p className="text-stone-500 text-sm max-w-sm mx-auto mt-1 mb-5">
            Try adjusting your search terms, price limit, or ask VoiceCart for another category.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-100 cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={startListening}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Search</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
