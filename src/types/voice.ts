import { ProductCategory } from './shopping';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'success' | 'error';

export type SupportedLanguage = 'en-US' | 'en-IN' | 'hi-IN' | 'ta-IN';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export type CommandActionType =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'UPDATE_ITEM'
  | 'MARK_PURCHASED'
  | 'SEARCH_PRODUCT'
  | 'FILTER_PRODUCTS'
  | 'SHOW_LIST'
  | 'CLEAR_LIST'
  | 'UNDO'
  | 'HELP'
  | 'UNKNOWN';

export interface ParsedItemEntity {
  raw: string;
  name: string;
  quantity: number;
  unit?: string;
  category?: ProductCategory;
  priceLimit?: number;
  brand?: string;
}

export interface ParsedCommand {
  rawTranscript: string;
  action: CommandActionType;
  items: ParsedItemEntity[];
  searchQuery?: string;
  categoryFilter?: ProductCategory;
  brandFilter?: string;
  minPrice?: number;
  maxPrice?: number;
  confidence: number;
  clarificationNeeded?: boolean;
  feedbackMessage: string;
  language: SupportedLanguage;
}
