import { SupportedLanguage } from '@/types/voice';

/**
 * Text to speech synthesizer using window.speechSynthesis
 */
export function speakConfirmation(
  text: string,
  language: SupportedLanguage = 'en-US',
  enabled: boolean = true
): void {
  if (!enabled || typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 1.05; // Slightly faster, natural pacing
    utterance.pitch = 1.0;

    // Try to pick a natural sounding voice for the requested language
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}
