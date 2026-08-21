'use client';

import React from 'react';
import { VoiceHero } from '@/components/voice/VoiceHero';
import { SmartSuggestions } from '@/components/suggestions/SmartSuggestions';
import { ShoppingListView } from '@/components/shopping-list/ShoppingListView';

export default function HomePage() {
  return (
    <div className="space-y-6 pb-6">
      {/* 1. Voice Hero (Centerpiece with 5 UX states and live transcript) */}
      <VoiceHero />

      {/* 2. Contextual Smart Suggestions */}
      <SmartSuggestions />

      {/* 3. Real-time Categorized Shopping List */}
      <ShoppingListView showFilters={true} />
    </div>
  );
}
