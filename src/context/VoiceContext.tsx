'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { VoiceState, SupportedLanguage, ParsedCommand } from '@/types/voice';
import { speechService } from '@/lib/voice/speechRecognition';
import { speakConfirmation } from '@/lib/voice/speechSynthesis';
import { parseNaturalCommand } from '@/lib/parser/commandParser';
import { useShopping } from './ShoppingContext';
import { useProducts } from './ProductContext';
import { getStoredItem, setStoredItem } from '@/lib/utils/storage';

interface VoiceContextType {
  voiceState: VoiceState;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  lastCommand: ParsedCommand | null;
  errorMessage: string | null;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  speechAudioFeedback: boolean;
  setSpeechAudioFeedback: (enabled: boolean) => void;
  isSpeechSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  processTextCommand: (text: string) => ParsedCommand;
  clearVoiceState: () => void;
  isModalOpen: boolean;
  openVoiceModal: () => void;
  closeVoiceModal: () => void;
}

const LANGUAGE_STORAGE_KEY = 'voicecart_lang_preference';
const AUDIO_FEEDBACK_STORAGE_KEY = 'voicecart_audio_feedback';

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { addParsedEntities, removeItem, updateItemQuantity, markItemPurchasedByName, clearList, undoLastAction } = useShopping();
  const { updateFilter } = useProducts();

  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [lastCommand, setLastCommand] = useState<ParsedCommand | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [language, setLanguageState] = useState<SupportedLanguage>(() =>
    getStoredItem<SupportedLanguage>(LANGUAGE_STORAGE_KEY, 'en-US')
  );
  const [speechAudioFeedback, setSpeechAudioFeedbackState] = useState<boolean>(() =>
    getStoredItem<boolean>(AUDIO_FEEDBACK_STORAGE_KEY, true)
  );
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(() => speechService.isSupported());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    setStoredItem(LANGUAGE_STORAGE_KEY, lang);
    speechService.setLanguage(lang);
  }, []);

  const setSpeechAudioFeedback = useCallback((enabled: boolean) => {
    setSpeechAudioFeedbackState(enabled);
    setStoredItem(AUDIO_FEEDBACK_STORAGE_KEY, enabled);
  }, []);

  const clearVoiceState = useCallback(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    setVoiceState('idle');
    setTranscript('');
    setInterimTranscript('');
    setErrorMessage(null);
  }, []);

  // Central Execution Pipeline for both Speech recognized text and typed text
  const executeCommand = useCallback((parsed: ParsedCommand) => {
    setLastCommand(parsed);

    switch (parsed.action) {
      case 'ADD_ITEM': {
        addParsedEntities(parsed.items, 'voice');
        break;
      }
      case 'REMOVE_ITEM': {
        if (parsed.items.length > 0) {
          removeItem(parsed.items[0].name);
        }
        break;
      }
      case 'UPDATE_ITEM': {
        if (parsed.items.length > 0) {
          const item = parsed.items[0];
          updateItemQuantity(item.name, item.quantity, item.unit);
        }
        break;
      }
      case 'MARK_PURCHASED': {
        if (parsed.items.length > 0) {
          markItemPurchasedByName(parsed.items[0].name);
        }
        break;
      }
      case 'SEARCH_PRODUCT': {
        updateFilter({
          query: parsed.searchQuery || '',
          category: parsed.categoryFilter || 'All',
          minPrice: parsed.minPrice,
          maxPrice: parsed.maxPrice
        });
        // Navigate to search page
        router.push('/search');
        break;
      }
      case 'SHOW_LIST': {
        router.push('/list');
        break;
      }
      case 'CLEAR_LIST': {
        clearList();
        break;
      }
      case 'UNDO': {
        undoLastAction();
        break;
      }
      case 'UNKNOWN':
      default: {
        break;
      }
    }

    // Spoken Audio Confirmation
    if (parsed.action !== 'UNKNOWN') {
      speakConfirmation(parsed.feedbackMessage, language, speechAudioFeedback);
    }
  }, [
    addParsedEntities,
    removeItem,
    updateItemQuantity,
    markItemPurchasedByName,
    updateFilter,
    router,
    clearList,
    undoLastAction,
    language,
    speechAudioFeedback
  ]);

  // Unified Text Command Handler
  const processTextCommand = useCallback((text: string): ParsedCommand => {
    setVoiceState('processing');
    setTranscript(text);
    setErrorMessage(null);

    const parsed = parseNaturalCommand(text, language);

    if (parsed.action === 'UNKNOWN') {
      setVoiceState('error');
      setErrorMessage(parsed.feedbackMessage);
    } else {
      executeCommand(parsed);
      setVoiceState('success');
    }

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setVoiceState('idle');
    }, 6000);

    return parsed;
  }, [language, executeCommand]);

  const handleFinalSpeechTranscript = useCallback((finalText: string) => {
    setTranscript(finalText);
    setInterimTranscript('');
    setVoiceState('processing');

    setTimeout(() => {
      const parsed = parseNaturalCommand(finalText, language);
      if (parsed.action === 'UNKNOWN') {
        setVoiceState('error');
        setErrorMessage(parsed.feedbackMessage);
      } else {
        executeCommand(parsed);
        setVoiceState('success');
      }

      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setVoiceState('idle');
      }, 6000);
    }, 350);
  }, [language, executeCommand]);

  const startListening = useCallback(() => {
    if (!speechService.isSupported()) {
      setIsSpeechSupported(false);
      setVoiceState('error');
      setErrorMessage("Voice input isn't supported in this browser. Please use the text command input below.");
      return;
    }

    clearVoiceState();

    const initialized = speechService.init(language, {
      onStart: () => {
        setVoiceState('listening');
        setErrorMessage(null);
      },
      onInterimResult: (interim) => {
        setInterimTranscript(interim);
      },
      onFinalResult: (final) => {
        handleFinalSpeechTranscript(final);
      },
      onError: (_type, message) => {
        setVoiceState('error');
        setErrorMessage(message);
      },
      onEnd: () => {
        // Handled in results
      }
    });

    if (initialized) {
      speechService.start();
    } else {
      setVoiceState('error');
      setErrorMessage('Could not initialize microphone. Please check permissions.');
    }
  }, [language, clearVoiceState, handleFinalSpeechTranscript]);

  const stopListening = useCallback(() => {
    speechService.stop();
  }, []);

  const openVoiceModal = useCallback(() => setIsModalOpen(true), []);
  const closeVoiceModal = useCallback(() => {
    stopListening();
    setIsModalOpen(false);
  }, [stopListening]);

  return (
    <VoiceContext.Provider
      value={{
        voiceState,
        isListening: voiceState === 'listening',
        transcript,
        interimTranscript,
        lastCommand,
        errorMessage,
        language,
        setLanguage,
        speechAudioFeedback,
        setSpeechAudioFeedback,
        isSpeechSupported,
        startListening,
        stopListening,
        processTextCommand,
        clearVoiceState,
        isModalOpen,
        openVoiceModal,
        closeVoiceModal
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
