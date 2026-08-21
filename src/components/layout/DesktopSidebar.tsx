'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListOrdered, Search, History, Settings, Mic, Sparkles, ShoppingBag } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';
import { useShopping } from '@/context/ShoppingContext';

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();
  const { startListening, isListening } = useVoice();
  const { unpurchasedCount, totalEstimatedCost } = useShopping();

  const navLinks = [
    { label: 'Home', href: '/', icon: Home, desc: 'Voice assistant & suggestions' },
    { label: 'Shopping List', href: '/list', icon: ListOrdered, badge: unpurchasedCount, desc: 'Organized by category' },
    { label: 'Product Search', href: '/search', icon: Search, desc: 'Voice & price filter' },
    { label: 'History & Reorder', href: '/history', icon: History, desc: 'Past grocery trips' },
    { label: 'Settings', href: '/settings', icon: Settings, desc: 'Preferences & languages' }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-stone-900 border-r border-stone-800 text-stone-300 min-h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="space-y-6">
        {/* Voice Trigger Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-stone-900 border border-emerald-800/40 text-white shadow-inner">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Voice Assistant
            </span>
          </div>
          <p className="text-xs text-stone-300 mb-3">
            Speak natural shopping commands anytime.
          </p>
          <button
            onClick={startListening}
            type="button"
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-stone-950 hover:brightness-105'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{isListening ? 'Listening...' : 'Tell VoiceCart'}</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Desktop sidebar" className="space-y-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-900/50 text-white border border-emerald-700/50 font-semibold'
                    : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                  <div>
                    <div className="text-sm">{link.label}</div>
                  </div>
                </div>

                {link.badge !== undefined && link.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Cart Quick Summary Box */}
      <div className="p-3.5 rounded-2xl bg-stone-800/60 border border-stone-700/60 text-xs">
        <div className="flex items-center justify-between font-semibold text-stone-200 mb-1">
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active List</span>
          </span>
          <span className="text-emerald-400 font-bold">{unpurchasedCount} items</span>
        </div>
        {totalEstimatedCost > 0 && (
          <p className="text-stone-400 text-[11px]">
            Est. total: <strong className="text-white">${totalEstimatedCost.toFixed(2)}</strong>
          </p>
        )}
      </div>
    </aside>
  );
};
