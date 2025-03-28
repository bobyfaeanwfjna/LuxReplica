import { z } from "zod";

// Core types from schema
export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  inspirationBrand: string;
  inStock: boolean;
  categoryId: number;
  details: string;
  comparison: string;
  material: string;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  topRated: boolean;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface ProductSize {
  id: number;
  productId: number;
  size: string;
  available: boolean;
}

export interface ProductColor {
  id: number;
  productId: number;
  color: string;
  colorName: string;
}

export interface Review {
  id: number;
  productId: number;
  rating: number;
  title: string;
  content: string;
  authorName: string;
  verifiedPurchase: boolean;
  date: Date;
}

export interface CartItem {
  id: number;
  sessionId: string;
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
}

// Composite types for UI
export interface ProductWithDetails extends Product {
  images: ProductImage[];
  sizes: ProductSize[];
  colors: ProductColor[];
  reviews: Review[];
  category: Category;
  rating: number;
  ratingBreakdown: RatingBreakdown[];
  relatedProducts?: ProductWithImage[];
}

export interface RatingBreakdown {
  stars: number;
  count: number;
}

export interface ProductWithImage extends Product {
  image: ProductImage;
  reviewCount: number;
  rating: number;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
  image: ProductImage;
}

export interface Cart {
  items: CartItemWithProduct[];
  subtotal: number;
  total: number;
  count: number;
}

// Form validation schemas
export const addToCartSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
  size: z.string().optional(),
  color: z.string().optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const reviewFormSchema = z.object({
  productId: z.number(),
  rating: z.number().min(1).max(5),
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Review must be at least 10 characters"),
  authorName: z.string().min(2, "Name must be at least 2 characters"),
});

export type AddToCartSchema = z.infer<typeof addToCartSchema>;
export type NewsletterSchema = z.infer<typeof newsletterSchema>;
export type ReviewFormSchema = z.infer<typeof reviewFormSchema>;

// Filter types
export type ProductFilter = {
  categorySlug?: string; 
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  topRated?: boolean;
};

export type FilterOption = 'all' | 'new' | 'bestsellers' | 'toprated';
