export type ProductCategory =
  | 'Produce'
  | 'Dairy'
  | 'Bakery'
  | 'Beverages'
  | 'Snacks'
  | 'Household'
  | 'Personal Care'
  | 'Pantry'
  | 'Other';

export interface ShoppingItem {
  id: string;
  name: string;
  category: ProductCategory;
  quantity: number;
  unit?: string;
  notes?: string;
  estimatedPrice?: number;
  purchased: boolean;
  addedAt: string; // ISO date string
  source?: 'voice' | 'text' | 'manual' | 'recommendation' | 'reorder';
}

export type UndoActionType = 
  | 'ADD_ITEM' 
  | 'REMOVE_ITEM' 
  | 'UPDATE_ITEM' 
  | 'MARK_PURCHASED' 
  | 'CLEAR_LIST'
  | 'BULK_ADD';

export interface UndoAction {
  id: string;
  type: UndoActionType;
  description: string;
  timestamp: number;
  previousItems: ShoppingItem[];
  itemsAffected?: ShoppingItem[];
}
