import { SupportedLanguage } from '@/types/voice';

// Declare types for Web Speech API
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onInterimResult?: (transcript: string) => void;
  onFinalResult?: (transcript: string) => void;
  onError?: (errorType: string, message: string) => void;
  onEnd?: () => void;
}

export class VoiceCartSpeechService {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListening: boolean = false;
  private currentLanguage: SupportedLanguage = 'en-US';

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public init(language: SupportedLanguage = 'en-US', callbacks: SpeechRecognitionCallbacks): boolean {
    if (!this.isSupported()) return false;

    this.currentLanguage = language;
    const SpeechConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechConstructor) return false;

    try {
      this.recognition = new SpeechConstructor();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = language;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        callbacks.onStart?.();
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript) {
          callbacks.onInterimResult?.(interimTranscript);
        }

        if (finalTranscript) {
          callbacks.onFinalResult?.(finalTranscript);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        this.isListening = false;
        let userFriendlyMsg = 'Speech recognition encountered an issue.';
        
        switch (event.error) {
          case 'not-allowed':
          case 'permission-denied':
            userFriendlyMsg = 'Microphone permission was denied. Please allow microphone access in your browser.';
            break;
          case 'no-speech':
            userFriendlyMsg = "No speech detected. Please speak clearly into your microphone.";
            break;
          case 'audio-capture':
            userFriendlyMsg = 'No microphone was found. Please ensure your audio input device is connected.';
            break;
          case 'network':
            userFriendlyMsg = 'Network error during speech recognition. Please check your connection.';
            break;
          default:
            userFriendlyMsg = `Recognition error: ${event.error}`;
        }

        callbacks.onError?.(event.error, userFriendlyMsg);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        callbacks.onEnd?.();
      };

      return true;
    } catch (e) {
      console.error('Error initializing speech recognition:', e);
      return false;
    }
  }

  public setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  public start(): boolean {
    if (!this.recognition) return false;
    if (this.isListening) return true;

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('Could not start speech recognition:', e);
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Could not stop speech recognition gracefully:', e);
      }
    }
    this.isListening = false;
  }

  public abort(): void {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        console.warn('Could not abort speech recognition:', e);
      }
    }
    this.isListening = false;
  }

  public getActiveListening(): boolean {
    return this.isListening;
  }
}

export const speechService = new VoiceCartSpeechService();
