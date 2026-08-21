'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, RotateCcw, X } from 'lucide-react';
import { useShopping } from '@/context/ShoppingContext';

export const CommandFeedbackToast: React.FC = () => {
  const { lastUndoAction, undoLastAction } = useShopping();
  const [dismissedActionId, setDismissedActionId] = useState<string | null>(null);

  const isVisible = !!lastUndoAction && dismissedActionId !== lastUndoAction.id;

  useEffect(() => {
    if (lastUndoAction) {
      const timer = setTimeout(() => {
        setDismissedActionId(lastUndoAction.id);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastUndoAction]);

  if (!isVisible || !lastUndoAction) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-full animate-slideUp">
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-900/95 border border-emerald-800 text-white shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xs font-medium text-stone-200 truncate">
            {lastUndoAction.description}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              undoLastAction();
              setDismissedActionId(lastUndoAction.id);
            }}
            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Undo
          </button>
          <button
            onClick={() => setDismissedActionId(lastUndoAction.id)}
            className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
