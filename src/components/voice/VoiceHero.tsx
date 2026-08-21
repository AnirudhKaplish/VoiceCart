'use client';

import React, { useState } from 'react';
import { Mic, MicOff, RotateCcw, Sparkles, CheckCircle2, AlertCircle, CornerDownLeft } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';
import { useShopping } from '@/context/ShoppingContext';
import { AudioWaveform } from './AudioWaveform';

const SAMPLE_PROMPTS = [
  'Add 2 apples and a bottle of milk',
  'Add 1 kg rice, 3 bananas and bread',
  'Find toothpaste under $5',
  'Remove milk',
  'Change apples to 5',
  'Mark bread as bought'
];

export const VoiceHero: React.FC = () => {
  const {
    voiceState,
    transcript,
    interimTranscript,
    lastCommand,
    errorMessage,
    startListening,
    stopListening,
    processTextCommand,
    clearVoiceState,
    isSpeechSupported
  } = useVoice();

  const { undoLastAction, undoStack } = useShopping();
  const [typedText, setTypedText] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedText.trim()) return;
    processTextCommand(typedText.trim());
    setTypedText('');
  };

  const handleSampleClick = (prompt: string) => {
    processTextCommand(prompt);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-900 via-emerald-950 to-stone-900 text-white p-6 sm:p-8 shadow-xl shadow-emerald-950/20 border border-emerald-800/40">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Brand Tagline & Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/40 border border-emerald-700/50 text-emerald-300 text-xs font-medium mb-3 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Voice-First Smart Shopping</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2">
          What&apos;s on your shopping list?
        </h1>
        <p className="text-emerald-200/80 text-sm sm:text-base mb-6 font-normal">
          &ldquo;Just say what you need.&rdquo; We&apos;ll parse items, quantities, and categories instantly.
        </p>

        {/* ---------------- STATE 1: READY ---------------- */}
        {voiceState === 'idle' && (
          <div className="flex flex-col items-center">
            <button
              onClick={startListening}
              type="button"
              aria-label="Start voice recognition"
              className="group relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-emerald-950 shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 cursor-pointer"
            >
              <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-30 group-hover:animate-ping" />
              <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-stone-950 relative z-10" />
            </button>

            <span className="mt-3.5 font-medium text-emerald-100 text-sm sm:text-base flex items-center gap-1.5">
              <span>Tap to speak</span>
            </span>

            {!isSpeechSupported && (
              <div className="mt-3 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs">
                Microphone speech API is not supported in this browser. Use the text box or sample buttons below.
              </div>
            )}
          </div>
        )}

        {/* ---------------- STATE 2: LISTENING ---------------- */}
        {voiceState === 'listening' && (
          <div className="flex flex-col items-center py-2 animate-fadeIn">
            <button
              onClick={stopListening}
              type="button"
              aria-label="Stop listening"
              className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-red-500 text-white shadow-lg shadow-red-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-50" />
              <MicOff className="w-10 h-10 sm:w-12 sm:h-12 relative z-10" />
            </button>

            <div className="mt-4">
              <AudioWaveform active={true} color="bg-emerald-400" />
              <p className="text-emerald-300 text-sm font-medium animate-pulse">
                Listening... speak clearly
              </p>
            </div>

            {/* Live Transcript Display */}
            <div className="mt-3 min-h-[2.5rem] px-4 py-2 rounded-xl bg-emerald-950/70 border border-emerald-700/40 text-emerald-100 text-sm italic max-w-lg">
              {interimTranscript || transcript || 'Say something like "Add 2 apples and milk"...'}
            </div>
          </div>
        )}

        {/* ---------------- STATE 3: PROCESSING ---------------- */}
        {voiceState === 'processing' && (
          <div className="flex flex-col items-center py-4 animate-fadeIn">
            <div className="w-20 h-20 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin flex items-center justify-center mb-3">
              <Sparkles className="w-8 h-8 text-emerald-300 animate-pulse" />
            </div>
            <p className="text-emerald-200 font-medium text-base">
              Understanding your request...
            </p>
            {transcript && (
              <p className="text-emerald-300/80 text-sm italic mt-1">&ldquo;{transcript}&rdquo;</p>
            )}
          </div>
        )}

        {/* ---------------- STATE 4: SUCCESS ---------------- */}
        {voiceState === 'success' && lastCommand && (
          <div className="flex flex-col items-center py-2 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-white">
              {lastCommand.feedbackMessage}
            </h2>

            {/* Entity pills */}
            {lastCommand.items && lastCommand.items.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-3 max-w-md">
                {lastCommand.items.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-600/40 text-emerald-200 text-xs font-medium"
                  >
                    <span>{item.quantity} {item.unit || ''}</span>
                    <strong className="text-white">{item.name}</strong>
                    {item.category && (
                      <span className="text-emerald-400 text-[10px] uppercase font-bold tracking-wider">
                        • {item.category}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}

            {/* Quick Actions in Success State */}
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => undoLastAction()}
                disabled={undoStack.length === 0}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 text-stone-200 text-xs font-medium border border-stone-600/50 transition-all duration-150 cursor-pointer disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>

              <button
                onClick={clearVoiceState}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-semibold shadow-md transition-all duration-150 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Speak Again</span>
              </button>
            </div>
          </div>
        )}

        {/* ---------------- STATE 5: ERROR ---------------- */}
        {voiceState === 'error' && (
          <div className="flex flex-col items-center py-2 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-rose-400 mb-3 shadow-inner">
              <AlertCircle className="w-10 h-10 text-rose-400" />
            </div>

            <h2 className="text-base sm:text-lg font-semibold text-rose-200 max-w-md">
              {errorMessage || "I didn't quite catch that."}
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1">
              Try saying <span className="text-emerald-300 font-medium">&ldquo;Add 2 apples&rdquo;</span> or <span className="text-emerald-300 font-medium">&ldquo;Find milk under $5&rdquo;</span>
            </p>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={startListening}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-semibold shadow-md transition-all duration-150 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Voice</span>
              </button>

              <button
                onClick={() => {
                  clearVoiceState();
                  setShowTextInput(true);
                }}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 text-stone-200 text-xs font-medium border border-stone-600/50 transition-all duration-150 cursor-pointer"
              >
                <span>Type Instead</span>
              </button>
            </div>
          </div>
        )}

        {/* Text Fallback Input Toggle & Form */}
        <div className="mt-6 pt-5 border-t border-emerald-800/30">
          {!showTextInput ? (
            <button
              onClick={() => setShowTextInput(true)}
              type="button"
              className="text-xs text-emerald-300/80 hover:text-emerald-200 underline underline-offset-4 transition-colors"
            >
              Or type a shopping command manually
            </button>
          ) : (
            <form onSubmit={handleTextSubmit} className="relative max-w-lg mx-auto flex items-center">
              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder='e.g., "Add 2 apples, 1 kg rice and bread"'
                className="w-full px-4 py-2.5 pr-12 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-white placeholder:text-emerald-300/40 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!typedText.trim()}
                aria-label="Send command"
                className="absolute right-1.5 p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 transition-colors disabled:opacity-40 disabled:hover:bg-emerald-500 cursor-pointer"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Quick Clickable Demo Prompts */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="text-[11px] uppercase tracking-wider text-emerald-300/60 font-semibold mr-1">
            Try Demo:
          </span>
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSampleClick(prompt)}
              type="button"
              className="text-xs px-2.5 py-1 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-200 border border-emerald-700/30 transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer text-left"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
