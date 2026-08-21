'use client';

import React from 'react';
import { ProductCatalog } from '@/components/products/ProductCatalog';

export default function SearchPage() {
  return (
    <div className="space-y-6 pb-6">
      <div className="border-b border-stone-200/80 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Product Discovery
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Explore catalog items or say <span className="text-emerald-700 font-semibold">&ldquo;Find toothpaste under $5&rdquo;</span> to filter by voice.
        </p>
      </div>

      <ProductCatalog />
    </div>
  );
}
