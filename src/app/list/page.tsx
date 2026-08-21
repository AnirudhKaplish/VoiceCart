'use client';

import React from 'react';
import { ShoppingListView } from '@/components/shopping-list/ShoppingListView';
import { SmartSuggestions } from '@/components/suggestions/SmartSuggestions';

export default function ListPage() {
  return (
    <div className="space-y-6 pb-6">
      <div className="border-b border-stone-200/80 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Shopping List
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Organize, check off, and manage items automatically sorted into supermarket categories.
        </p>
      </div>

      <ShoppingListView showFilters={true} />

      <SmartSuggestions />
    </div>
  );
}
