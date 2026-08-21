'use client';

import React, { useState } from 'react';
import { X, Mic, MicOff, RotateCcw, CornerDownLeft, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';
import { useShopping } from '@/context/ShoppingContext';
import { AudioWaveform } from './AudioWaveform';

export const VoiceModal: React.FC = () => {
  const {
    isModalOpen,
    closeVoiceModal,
    voiceState,
    transcript,
    interimTranscript,
    lastCommand,
    errorMessage,
    startListening,
    stopListening,
    processTextCommand,
    clearVoiceState
  } = useVoice();

  const { undoLastAction } = useShopping();
  const [typedInput, setTypedInput] = useState('');

  if (!isModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    processTextCommand(typedInput.trim());
    setTypedInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-stone-900 border border-emerald-800/50 text-white rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeVoiceModal}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          aria-label="Close voice assistant"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pt-2 pb-4">
          <div className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VoiceCart Assistant</span>
          </div>
          <h2 className="text-xl font-bold text-white">What can I get for you?</h2>
        </div>

        {/* Interactive Centerpiece */}
        <div className="my-6 flex flex-col items-center">
          {voiceState === 'idle' && (
            <button
              onClick={startListening}
              type="button"
              className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-stone-950 shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <Mic className="w-10 h-10" />
            </button>
          )}

          {voiceState === 'listening' && (
            <div className="flex flex-col items-center">
              <button
                onClick={stopListening}
                type="button"
                className="relative flex items-center justify-center w-24 h-24 rounded-full bg-red-500 text-white shadow-xl shadow-red-500/40 animate-pulse hover:scale-105 transition-transform cursor-pointer"
              >
                <MicOff className="w-10 h-10" />
              </button>
              <div className="mt-3">
                <AudioWaveform active={true} color="bg-emerald-400" />
                <p className="text-xs text-emerald-300 font-medium animate-pulse">Listening...</p>
              </div>
              <p className="mt-2 text-sm text-stone-200 italic max-w-xs text-center px-3 py-1.5 bg-stone-800/80 rounded-xl">
                {interimTranscript || transcript || 'Say your command...'}
              </p>
            </div>
          )}

          {voiceState === 'processing' && (
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin mb-3" />
              <p className="text-emerald-300 font-medium text-sm">Processing command...</p>
            </div>
          )}

          {voiceState === 'success' && lastCommand && (
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
              <p className="font-semibold text-white text-base">{lastCommand.feedbackMessage}</p>
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => undoLastAction()}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs flex items-center gap-1 border border-stone-700"
                >
                  <RotateCcw className="w-3 h-3" />
                  Undo
                </button>
                <button
                  onClick={clearVoiceState}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-emerald-950 text-xs font-semibold"
                >
                  Speak Again
                </button>
              </div>
            </div>
          )}

          {voiceState === 'error' && (
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="w-12 h-12 text-rose-400 mb-2" />
              <p className="font-medium text-rose-200 text-sm">{errorMessage}</p>
              <button
                onClick={startListening}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-emerald-950 text-xs font-semibold"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Text fallback input */}
        <form onSubmit={handleSubmit} className="relative mt-4">
          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder='Or type "Add 2 apples and milk"...'
            className="w-full px-4 py-2.5 pr-10 rounded-xl bg-stone-800 border border-stone-700 text-white placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            disabled={!typedInput.trim()}
            className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-emerald-500 text-stone-950 disabled:opacity-30"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
