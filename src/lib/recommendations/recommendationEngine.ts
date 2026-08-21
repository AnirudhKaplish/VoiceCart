import { Product } from '@/types/product';
import { ShoppingItem } from '@/types/shopping';
import { SmartRecommendation, PurchaseHistoryRecord, ProductPurchaseStats } from '@/types/recommendation';
import { MOCK_PRODUCTS } from '@/data/products';

/**
 * Calculates purchase intervals and statistics from previous shopping history
 */
export function calculatePurchaseStats(history: PurchaseHistoryRecord[]): Map<string, ProductPurchaseStats> {
  const statsMap = new Map<string, { dates: number[]; totalQty: number; name: string }>();

  // Collect occurrences of each product
  history.forEach(trip => {
    const tripTime = new Date(trip.date).getTime();
    trip.items.forEach(item => {
      const normalizedName = item.name.toLowerCase().trim();
      const existing = statsMap.get(normalizedName) || { dates: [], totalQty: 0, name: item.name };
      existing.dates.push(tripTime);
      existing.totalQty += item.quantity;
      statsMap.set(normalizedName, existing);
    });
  });

  const resultMap = new Map<string, ProductPurchaseStats>();

  statsMap.forEach((data, key) => {
    // Sort dates ascending
    data.dates.sort((a, b) => a - b);
    const count = data.dates.length;
    const lastDate = new Date(data.dates[count - 1]).toISOString();

    let avgIntervalDays = 7; // default 7 days if only 1 purchase
    if (count > 1) {
      const totalSpanMs = data.dates[count - 1] - data.dates[0];
      const intervals = count - 1;
      avgIntervalDays = Math.round(totalSpanMs / (intervals * 24 * 60 * 60 * 1000));
    }

    resultMap.set(key, {
      productName: data.name,
      totalTimesBought: count,
      averageIntervalDays: Math.max(1, avgIntervalDays),
      lastPurchasedDate: lastDate,
      averageQuantity: Math.round(data.totalQty / count) || 1
    });
  });

  return resultMap;
}

/**
 * Generates contextual smart recommendations based on history, seasonal picks, and substitutions
 */
export function generateSmartRecommendations(
  currentItems: ShoppingItem[],
  history: PurchaseHistoryRecord[],
  catalog: Product[] = MOCK_PRODUCTS
): SmartRecommendation[] {
  const recommendations: SmartRecommendation[] = [];
  const currentItemNames = new Set(currentItems.map(i => i.name.toLowerCase().trim()));
  const stats = calculatePurchaseStats(history);
  const now = Date.now();

  // 1. REPLENISHMENT / RUNNING LOW (Based on history cycle)
  stats.forEach((stat) => {
    const lastPurchasedTime = new Date(stat.lastPurchasedDate).getTime();
    const daysSinceLastPurchase = Math.floor((now - lastPurchasedTime) / (24 * 60 * 60 * 1000));
    
    // Find corresponding product in catalog
    const matchedProduct = catalog.find(p => 
      p.name.toLowerCase().includes(stat.productName.toLowerCase()) ||
      stat.productName.toLowerCase().includes(p.name.toLowerCase())
    );

    // If not already in list and interval threshold is reached or approached
    if (matchedProduct && !currentItemNames.has(matchedProduct.name.toLowerCase())) {
      if (daysSinceLastPurchase >= stat.averageIntervalDays - 1) {
        recommendations.push({
          id: `rec-rep-${matchedProduct.id}`,
          product: matchedProduct,
          reasonType: 'REPLENISHMENT',
          headline: `You usually buy ${matchedProduct.name.split(' ')[0]} every ${stat.averageIntervalDays} days`,
          explanation: `Bought ${daysSinceLastPurchase} days ago across ${stat.totalTimesBought} past shopping trips.`,
          confidenceScore: 0.95,
          badgeText: 'Replenishment'
        });
      }
    }
  });

  // 2. OUT-OF-STOCK OR HEALTHY SUBSTITUTES
  // Check if any item in current shopping list is out of stock in catalog
  currentItems.forEach(item => {
    const productInCatalog = catalog.find(p => p.name.toLowerCase() === item.name.toLowerCase());
    if (productInCatalog && !productInCatalog.inStock && productInCatalog.substituteProductIds?.length) {
      productInCatalog.substituteProductIds.forEach(subId => {
        const substituteProduct = catalog.find(p => p.id === subId);
        if (substituteProduct && substituteProduct.inStock && !currentItemNames.has(substituteProduct.name.toLowerCase())) {
          recommendations.push({
            id: `rec-sub-${substituteProduct.id}`,
            product: substituteProduct,
            reasonType: 'SUBSTITUTE',
            headline: `${productInCatalog.name} is currently out of stock`,
            explanation: `Top-rated alternative with ${substituteProduct.rating || 4.8}★ rating.`,
            confidenceScore: 0.98,
            badgeText: 'Substitute Available',
            originalProductId: productInCatalog.id,
            originalProductName: productInCatalog.name
          });
        }
      });
    }
  });

  // 3. SEASONAL PICKS
  catalog
    .filter(p => p.seasonal && p.inStock && !currentItemNames.has(p.name.toLowerCase()))
    .slice(0, 3)
    .forEach(p => {
      // Avoid duplicate product recommendations
      if (!recommendations.some(r => r.product.id === p.id)) {
        recommendations.push({
          id: `rec-season-${p.id}`,
          product: p,
          reasonType: 'SEASONAL',
          headline: `Seasonal Favorite: ${p.name}`,
          explanation: p.seasonalReason || 'Fresh seasonal harvest at peak flavor and value.',
          confidenceScore: 0.85,
          badgeText: 'Seasonal Pick'
        });
      }
    });

  // 4. POPULAR STAPLES (Fallback if recommendations are few)
  if (recommendations.length < 4) {
    catalog
      .filter(p => p.inStock && (p.rating || 0) >= 4.8 && !currentItemNames.has(p.name.toLowerCase()))
      .slice(0, 4 - recommendations.length)
      .forEach(p => {
        if (!recommendations.some(r => r.product.id === p.id)) {
          recommendations.push({
            id: `rec-pop-${p.id}`,
            product: p,
            reasonType: 'POPULAR',
            headline: `Trending in ${p.category}`,
            explanation: `Highly rated staple with ${p.rating}★ rating from verified shoppers.`,
            confidenceScore: 0.75,
            badgeText: 'Weekly Favorite'
          });
        }
      });
  }

  // Sort by confidence score descending
  return recommendations.sort((a, b) => b.confidenceScore - a.confidenceScore);
}
