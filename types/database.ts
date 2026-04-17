export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type NutritionData = {
  calories: number;
  fat_g: number;
  saturated_fat_g: number;
  trans_fat_g: number;
  carbs_g: number;
  fiber_g: number;
  sugars_g: number;
  protein_g: number;
  sodium_mg: number;
  potassium_mg?: number;
  iron_mg?: number;
  active_compounds?: ActiveCompound[];
};

export type ActiveCompound = {
  name_en: string;
  name_ja: string;
  amount: string;
  unit: string;
  is_key: boolean;
};

export type Product = {
  id: string;
  name_ja: string;
  name_en: string;
  description_ja: string;
  description_en: string;
  ingredients: string;
  ingredients_en: string;
  ingredients_ja: string;
  how_to_use: string;
  category: string;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  image_urls: string[];
  rating_avg: number;
  review_count: number;
  is_bestseller: boolean;
  is_new: boolean;
  nutrition_per_serving: NutritionData | null;
  certifications: string[];
  serving_size: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  fulfillment_type: "pickup";
  pickup_date: string;
  pickup_slot: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
  payment_status: "pending" | "paid" | "failed";
  order_status: "confirmed" | "ready" | "completed" | "cancelled";
  created_at: string;
};

export type OrderItem = {
  product_id: string;
  name_ja: string;
  name_en: string;
  variant?: string;
  quantity: number;
  unit_price: number;
  image_url: string;
};

export type CartItem = {
  id: string;
  session_id: string | null;
  user_id: string | null;
  product_id: string;
  variant: string | null;
  quantity: number;
  created_at: string;
};

export type Review = {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  verified: boolean;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at">;
        Update: Partial<Omit<Product, "id" | "created_at">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at">;
        Update: Partial<Omit<Order, "id" | "created_at">>;
      };
      cart_items: {
        Row: CartItem;
        Insert: Omit<CartItem, "id" | "created_at">;
        Update: Partial<Omit<CartItem, "id" | "created_at">>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, "id" | "created_at">;
        Update: Partial<Omit<Review, "id" | "created_at">>;
      };
    };
  };
}
