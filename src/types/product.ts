import { ProductCategory } from './shopping';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  price: number;
  unit: string;
  size: string;
  image: string;
  emoji: string;
  inStock: boolean;
  stockCount: number;
  tags: string[];
  seasonal?: boolean;
  seasonalReason?: string;
  substituteProductIds?: string[];
  rating?: number;
  nutritionHighlights?: string[];
}

export interface ProductFilterState {
  query: string;
  category: ProductCategory | 'All';
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  tags: string[];
}
