'use client';

import React, { useState } from 'react';
import { X, Play } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { processTextCommand } = useVoice();

  if (dismissed) return null;

  const handleRunDemo = (query: string) => {
    processTextCommand(query);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-b border-emerald-800/40 text-white px-4 py-2.5 sm:px-6 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold shrink-0">
            👋 Welcome to VoiceCart
          </span>
          <span className="text-stone-300">
            Voice-first shopping list with AI entity parsing, multi-item recognition, &amp; smart suggestions.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleRunDemo('Add 2 apples, 1 kg rice and 3 bottles of water')}
            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Play className="w-3 h-3 fill-stone-950" />
            <span>Test Multi-Item</span>
          </button>

          <button
            onClick={() => handleRunDemo('Find toothpaste under $5')}
            className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-700/40 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Test Price Filter</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-stone-400 hover:text-white rounded-lg"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
