'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Volume2, VolumeX, Globe } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';
import { useShopping } from '@/context/ShoppingContext';
import { SUPPORTED_LANGUAGES } from '@/lib/parser/multilingual';
import { SupportedLanguage } from '@/types/voice';

function getGreeting(): string {
  if (typeof window === 'undefined') return 'Welcome';
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export const Header: React.FC = () => {
  const { language, setLanguage, speechAudioFeedback, setSpeechAudioFeedback } = useVoice();
  const { unpurchasedCount } = useShopping();
  const greeting = getGreeting();

  return (
    <header className="sticky top-0 z-30 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 text-white transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-stone-950 font-black shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <span className="text-lg">🎙️</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">VoiceCart</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                AI Voice
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block">Just say what you need</p>
          </div>
        </Link>

        {/* Greeting and Quick Controls */}
        <div className="flex items-center gap-3">
          <span suppressHydrationWarning className="text-xs text-stone-300 hidden md:inline font-medium">
            👋 {greeting}
          </span>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              aria-label="Select voice recognition language"
              className="px-2.5 py-1.5 pr-6 rounded-xl bg-stone-800 border border-stone-700 text-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
            <Globe className="w-3.5 h-3.5 text-stone-400 absolute right-2 pointer-events-none" />
          </div>

          {/* Audio Feedback Toggle */}
          <button
            type="button"
            onClick={() => setSpeechAudioFeedback(!speechAudioFeedback)}
            aria-label={`Turn spoken audio feedback ${speechAudioFeedback ? 'off' : 'on'}`}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              speechAudioFeedback
                ? 'bg-emerald-950/60 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
            }`}
            title={`Spoken Voice Feedback: ${speechAudioFeedback ? 'Enabled' : 'Disabled'}`}
          >
            {speechAudioFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Shopping Cart Quick Badge */}
          <Link
            href="/list"
            className="relative p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-transform active:scale-95"
            aria-label="View shopping list"
          >
            <ShoppingCart className="w-4 h-4" />
            {unpurchasedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow">
                {unpurchasedCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
