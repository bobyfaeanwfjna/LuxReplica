import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  originalPrice: doublePrecision("original_price"),
  inspirationBrand: text("inspiration_brand").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  categoryId: integer("category_id").notNull(),
  details: text("details").notNull(),
  comparison: text("comparison").notNull(),
  material: text("material").notNull(),
  featured: boolean("featured").notNull().default(false),
  newArrival: boolean("new_arrival").notNull().default(false),
  bestSeller: boolean("best_seller").notNull().default(false),
  topRated: boolean("top_rated").notNull().default(false),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  imageUrl: text("image_url").notNull(),
  isPrimary: boolean("is_primary").notNull().default(false),
});

export const productSizes = pgTable("product_sizes", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  size: text("size").notNull(),
  available: boolean("available").notNull().default(true),
});

export const productColors = pgTable("product_colors", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  color: text("color").notNull(),
  colorName: text("color_name").notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorName: text("author_name").notNull(),
  verifiedPurchase: boolean("verified_purchase").notNull().default(false),
  date: timestamp("date").notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  size: text("size"),
  color: text("color"),
});

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertProductImageSchema = createInsertSchema(productImages).omit({ id: true });
export const insertProductSizeSchema = createInsertSchema(productSizes).omit({ id: true });
export const insertProductColorSchema = createInsertSchema(productColors).omit({ id: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true });

// Types
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
export type InsertProductSize = z.infer<typeof insertProductSizeSchema>;
export type InsertProductColor = z.infer<typeof insertProductColorSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;
export type ProductSize = typeof productSizes.$inferSelect;
export type ProductColor = typeof productColors.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;

// For frontend use
export type ProductWithDetails = Product & {
  images: ProductImage[];
  sizes: ProductSize[];
  colors: ProductColor[];
  reviews: Review[];
  category: Category;
};

export type CartItemWithProduct = CartItem & {
  product: Product;
  image: ProductImage;
};
