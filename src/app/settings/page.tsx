'use client';

import React, { useState } from 'react';
import { Mic, Check, Sparkles } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';
import { useShopping } from '@/context/ShoppingContext';
import { useProducts } from '@/context/ProductContext';
import { SUPPORTED_LANGUAGES } from '@/lib/parser/multilingual';

export default function SettingsPage() {
  const { language, setLanguage, speechAudioFeedback, setSpeechAudioFeedback, isSpeechSupported } = useVoice();
  const { clearList, resetToSampleData } = useShopping();
  const { resetHistoryToDefault } = useProducts();

  const [clearedMsg, setClearedMsg] = useState<string | null>(null);

  const triggerFeedback = (msg: string) => {
    setClearedMsg(msg);
    setTimeout(() => setClearedMsg(null), 3000);
  };

  return (
    <div className="space-y-6 pb-6 max-w-3xl">
      <div className="border-b border-stone-200/80 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Settings &amp; Preferences
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Customize speech recognition, language dialect, audio feedback, and local demo data.
        </p>
      </div>

      {clearedMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{clearedMsg}</span>
        </div>
      )}

      {/* Voice & Speech Recognition Settings */}
      <section className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-stone-900 text-base">Voice Recognition Settings</h2>
            <p className="text-xs text-stone-500">Configure speech engine preferences and multilingual model</p>
          </div>
        </div>

        {/* Browser Speech Compatibility Status */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
          <div>
            <span className="font-semibold text-stone-900">Speech Recognition Engine</span>
            <p className="text-stone-500">Native Web Speech API</p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
              isSpeechSupported
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-rose-100 text-rose-800 border border-rose-200'
            }`}
          >
            {isSpeechSupported ? '✓ Supported' : '⚠ Fallback Only'}
          </span>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Voice Input &amp; Assistant Language
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{lang.flag}</span>
                    <div>
                      <div className="text-xs font-bold">{lang.label}</div>
                      <div className="text-[11px] text-stone-400">{lang.nativeLabel}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio Synthesis Confirmation Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <div>
            <span className="text-sm font-semibold text-stone-900">Spoken Audio Confirmations</span>
            <p className="text-xs text-stone-500">
              Speak action summaries out loud after voice commands (e.g. &ldquo;Added 2 apples&rdquo;)
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={speechAudioFeedback}
              onChange={(e) => setSpeechAudioFeedback(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
          </label>
        </div>
      </section>

      {/* Demo Data Management */}
      <section className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-stone-900 text-base">Demo &amp; Local Data Management</h2>
            <p className="text-xs text-stone-500">Reset pre-seeded purchase history and sample lists for evaluator testing</p>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
            <div>
              <span className="font-semibold text-stone-800">Reset to Sample Shopping List</span>
              <p className="text-stone-500">Restores initial Produce, Dairy, and Bakery demonstration items</p>
            </div>
            <button
              onClick={() => {
                resetToSampleData();
                triggerFeedback('Shopping list reset to sample items.');
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 font-semibold text-stone-700 cursor-pointer"
            >
              Reset List
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
            <div>
              <span className="font-semibold text-stone-800">Reload Purchase History (Smart Suggestions)</span>
              <p className="text-stone-500">Re-seeds 4 historical shopping sessions to demonstrate replenishment</p>
            </div>
            <button
              onClick={() => {
                resetHistoryToDefault();
                triggerFeedback('Purchase history reset to default demonstration data.');
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 font-semibold text-stone-700 cursor-pointer"
            >
              Reload History
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
            <div>
              <span className="font-semibold text-rose-700">Clear Active Shopping List</span>
              <p className="text-stone-500">Removes all items from current cart (reversible via Undo)</p>
            </div>
            <button
              onClick={() => {
                clearList();
                triggerFeedback('Active shopping list cleared.');
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 font-semibold text-rose-700 cursor-pointer"
            >
              Clear List
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
