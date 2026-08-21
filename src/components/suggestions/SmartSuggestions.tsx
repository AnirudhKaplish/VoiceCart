'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import { SuggestionCard } from './SuggestionCard';

export const SmartSuggestions: React.FC = () => {
  const { recommendations, dismissRecommendation } = useProducts();

  if (recommendations.length === 0) return null;

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-stone-900 text-lg sm:text-xl">Smart Suggestions</h2>
            <p className="text-xs text-stone-500">Based on your weekly routine and seasonal items</p>
          </div>
        </div>

        <Link
          href="/search"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 group"
        >
          <span>Discover more</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.slice(0, 3).map((rec) => (
          <SuggestionCard
            key={rec.id}
            recommendation={rec}
            onDismiss={dismissRecommendation}
          />
        ))}
      </div>
    </section>
  );
};
