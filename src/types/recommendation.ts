import { Product } from './product';
import { ShoppingItem } from './shopping';

export type RecommendationReasonType =
  | 'REPLENISHMENT'   // "You usually buy milk every 7 days"
  | 'RUNNING_LOW'     // "You bought bread 6 days ago and might be running low"
  | 'SEASONAL'        // "Fresh strawberries are in peak season"
  | 'SUBSTITUTE'      // "Whole Milk is out of stock - try Oat Milk"
  | 'POPULAR'         // "Trending in Produce this week"
  | 'FREQUENT_STAPLE';// "Frequently added on Friday"

export interface SmartRecommendation {
  id: string;
  product: Product;
  reasonType: RecommendationReasonType;
  headline: string; // e.g. "Running low on milk?"
  explanation: string; // e.g. "You usually buy this every 7 days (last bought 6 days ago)"
  confidenceScore: number;
  badgeText: string;
  originalProductId?: string; // If it's a substitute for another product
  originalProductName?: string;
  isDismissed?: boolean;
}

export interface PurchaseHistoryRecord {
  id: string;
  date: string; // ISO date
  storeName?: string;
  totalSpent: number;
  items: ShoppingItem[];
}

export interface ProductPurchaseStats {
  productId?: string;
  productName: string;
  totalTimesBought: number;
  averageIntervalDays: number;
  lastPurchasedDate: string; // ISO
  averageQuantity: number;
}
