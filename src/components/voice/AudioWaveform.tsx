'use client';

import React from 'react';

interface AudioWaveformProps {
  active?: boolean;
  color?: string;
}

const BAR_HEIGHT_FACTORS = [0.75, 1.1, 1.4, 0.9, 1.3, 1.5, 1.2, 0.8, 1.3, 0.95, 0.7];

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  active = true,
  color = 'bg-emerald-500'
}) => {
  return (
    <div className="flex items-center justify-center gap-1.5 h-12 py-2" aria-hidden="true">
      {[16, 28, 40, 24, 36, 48, 32, 20, 36, 24, 16].map((baseHeight, idx) => (
        <span
          key={idx}
          className={`w-1.5 rounded-full transition-all duration-300 ${color} ${
            active ? 'animate-pulse' : 'opacity-40'
          }`}
          style={{
            height: active ? `${Math.max(12, baseHeight * BAR_HEIGHT_FACTORS[idx % BAR_HEIGHT_FACTORS.length])}px` : '8px',
            animationDelay: `${idx * 75}ms`,
            animationDuration: '600ms'
          }}
        />
      ))}
    </div>
  );
};
