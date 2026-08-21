'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListOrdered, Search, History, Settings, Mic } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';
import { useShopping } from '@/context/ShoppingContext';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { openVoiceModal, startListening, isListening } = useVoice();
  const { unpurchasedCount } = useShopping();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'List', href: '/list', icon: ListOrdered, badge: unpurchasedCount },
    { label: 'Search', href: '/search', icon: Search },
    { label: 'History', href: '/history', icon: History },
    { label: 'Settings', href: '/settings', icon: Settings }
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/80 px-2 py-1.5 shadow-lg"
    >
      <div className="flex items-center justify-around relative max-w-md mx-auto">
        {/* Left 2 items */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors relative ${
                isActive ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 px-1 min-w-[14px] h-[14px] rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}

        {/* Center Floating Mic Button */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            onClick={() => {
              openVoiceModal();
              startListening();
            }}
            type="button"
            aria-label="Activate voice assistant"
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white ring-4 ring-rose-300 animate-pulse shadow-rose-500/40'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-600/30 hover:scale-105'
            }`}
          >
            <Mic className="w-7 h-7" />
          </button>
          <span className="text-[10px] font-bold text-emerald-800 mt-0.5">Voice</span>
        </div>

        {/* Right 3 items */}
        {navItems.slice(2).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors relative ${
                isActive ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-900 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
