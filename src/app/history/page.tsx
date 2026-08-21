'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Check, RotateCcw, Sparkles } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useShopping } from '@/context/ShoppingContext';
import { calculatePurchaseStats } from '@/lib/recommendations/recommendationEngine';
import { CATEGORIES_META } from '@/lib/utils/categories';

export default function HistoryPage() {
  const { history, addHistoryTripToList, resetHistoryToDefault } = useProducts();
  const { addItem } = useShopping();
  const [reorderedTripId, setReorderedTripId] = useState<string | null>(null);

  const statsMap = calculatePurchaseStats(history);
  const frequentItems = Array.from(statsMap.values()).sort(
    (a, b) => b.totalTimesBought - a.totalTimesBought
  );

  const handleReorderTrip = (tripId: string) => {
    addHistoryTripToList(tripId);
    setReorderedTripId(tripId);
    setTimeout(() => setReorderedTripId(null), 2500);
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="border-b border-stone-200/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Purchase History
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review past grocery sessions and replenish staples with a single tap.
          </p>
        </div>

        <button
          onClick={resetHistoryToDefault}
          type="button"
          className="self-start px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample History</span>
        </button>
      </div>

      {/* Frequently Purchased Staples Widget */}
      <section className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-stone-900 text-base">Frequently Purchased Staples</h2>
            <p className="text-xs text-stone-500">Calculated cycle intervals feeding your smart recommendations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {frequentItems.slice(0, 6).map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-xs text-stone-900 truncate">
                  {stat.productName}
                </h3>
                <p className="text-[11px] text-stone-500">
                  Bought {stat.totalTimesBought}x • every ~{stat.averageIntervalDays} days
                </p>
              </div>

              <button
                onClick={() => addItem(stat.productName, stat.averageQuantity, undefined, undefined, undefined, 'reorder')}
                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-sm"
                title="Add to current list"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Past Trips Timeline */}
      <section className="space-y-4">
        <h2 className="font-bold text-stone-900 text-lg">Past Shopping Trips ({history.length})</h2>

        {history.map((trip) => {
          const tripDate = new Date(trip.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          const isReordered = reorderedTripId === trip.id;

          return (
            <div
              key={trip.id}
              className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm transition-all hover:border-emerald-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">
                    <Calendar className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                      {trip.storeName || 'Grocery Trip'}
                    </h3>
                    <p suppressHydrationWarning className="text-xs text-stone-500">{tripDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-stone-900">
                    ${trip.totalSpent.toFixed(2)}
                  </span>

                  <button
                    onClick={() => handleReorderTrip(trip.id)}
                    disabled={isReordered}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isReordered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 hover:border-emerald-600'
                    }`}
                  >
                    {isReordered ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added All!</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder Trip</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Items in this trip */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {trip.items.map((item, idx) => {
                  const meta = CATEGORIES_META[item.category] || CATEGORIES_META.Other;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-stone-50 text-xs text-stone-700"
                    >
                      <span className="truncate flex items-center gap-1.5">
                        <span>{meta.emoji}</span>
                        <span className="font-medium text-stone-800">{item.name}</span>
                      </span>
                      <span className="text-stone-500 font-semibold shrink-0">
                        {item.quantity} {item.unit || ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
