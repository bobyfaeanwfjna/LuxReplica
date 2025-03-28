import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { randomUUID } from "crypto";
import { insertCartItemSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/categories", async (req: Request, res: Response) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/products", async (req: Request, res: Response) => {
    const { category, filter } = req.query;
    
    const filters: {
      categorySlug?: string;
      featured?: boolean;
      newArrival?: boolean;
      bestSeller?: boolean;
      topRated?: boolean;
    } = {};
    
    if (category) {
      filters.categorySlug = category as string;
    }
    
    if (filter === "featured") {
      filters.featured = true;
    } else if (filter === "new") {
      filters.newArrival = true;
    } else if (filter === "bestsellers") {
      filters.bestSeller = true;
    } else if (filter === "toprated") {
      filters.topRated = true;
    }
    
    const products = await storage.getProducts(filters);
    
    // For each product, get the first image
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await storage.getProductImages(product.id);
        const primaryImage = images.find(img => img.isPrimary) || images[0];
        
        // Get reviews for rating calculation
        const reviews = await storage.getReviews(product.id);
        const rating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0;
        
        return {
          ...product,
          image: primaryImage,
          reviewCount: reviews.length,
          rating
        };
      })
    );
    
    res.json(productsWithImages);
  });

  app.get("/api/products/:slug", async (req: Request, res: Response) => {
    const { slug } = req.params;
    const product = await storage.getProductWithDetails(slug);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Calculate average rating
    const rating = product.reviews.length > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
      : 0;
    
    // Calculate rating breakdown
    const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: product.reviews.filter(review => review.rating === stars).length
    }));
    
    // Get related products (same category, excluding current product)
    const relatedProducts = await storage.getProducts({ 
      categorySlug: product.category.slug 
    });
    
    const filteredRelated = relatedProducts
      .filter(p => p.id !== product.id)
      .slice(0, 4);
    
    const relatedWithImages = await Promise.all(
      filteredRelated.map(async (related) => {
        const images = await storage.getProductImages(related.id);
        const primaryImage = images.find(img => img.isPrimary) || images[0];
        
        // Get reviews for rating calculation
        const reviews = await storage.getReviews(related.id);
        const rating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0;
        
        return {
          ...related,
          image: primaryImage,
          reviewCount: reviews.length,
          rating
        };
      })
    );
    
    res.json({
      ...product,
      rating,
      ratingBreakdown,
      relatedProducts: relatedWithImages
    });
  });
  
  // Cart endpoints
  app.get("/api/cart", async (req: Request, res: Response) => {
    // Use session ID from cookie or create new one
    let sessionId = req.cookies?.cartSessionId;
    
    if (!sessionId) {
      sessionId = randomUUID();
      // Set cookie for 30 days
      res.cookie("cartSessionId", sessionId, { 
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
    }
    
    const cartItems = await storage.getCartItems(sessionId);
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    res.json({
      items: cartItems,
      subtotal,
      total: subtotal, // Can add shipping, tax, etc. here
      count: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  });
  
  app.post("/api/cart", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const cartItemData = insertCartItemSchema.parse(req.body);
      
      // Use session ID from cookie or create new one
      let sessionId = req.cookies?.cartSessionId;
      
      if (!sessionId) {
        sessionId = randomUUID();
        // Set cookie for 30 days
        res.cookie("cartSessionId", sessionId, { 
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true
        });
      }
      
      // Override session ID to use the one from the cookie
      const cartItem = await storage.createCartItem({
        ...cartItemData,
        sessionId
      });
      
      // Get updated cart
      const cartItems = await storage.getCartItems(sessionId);
      
      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
      }, 0);
      
      res.status(201).json({
        items: cartItems,
        subtotal,
        total: subtotal,
        count: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ message: "An error occurred adding item to cart" });
    }
  });
  
  app.put("/api/cart/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;
    
    if (typeof quantity !== "number" || quantity < 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }
    
    const cartItem = await storage.getCartItem(Number(id));
    
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    // Check session ID to ensure ownership
    const sessionId = req.cookies?.cartSessionId;
    
    if (!sessionId || cartItem.sessionId !== sessionId) {
      return res.status(403).json({ message: "Not authorized to modify this cart item" });
    }
    
    await storage.updateCartItemQuantity(Number(id), quantity);
    
    // Get updated cart
    const cartItems = await storage.getCartItems(sessionId);
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    res.json({
      items: cartItems,
      subtotal,
      total: subtotal,
      count: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  });
  
  app.delete("/api/cart/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const cartItem = await storage.getCartItem(Number(id));
    
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    // Check session ID to ensure ownership
    const sessionId = req.cookies?.cartSessionId;
    
    if (!sessionId || cartItem.sessionId !== sessionId) {
      return res.status(403).json({ message: "Not authorized to delete this cart item" });
    }
    
    await storage.deleteCartItem(Number(id));
    
    // Get updated cart
    const cartItems = await storage.getCartItems(sessionId);
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    res.json({
      items: cartItems,
      subtotal,
      total: subtotal,
      count: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  });
  
  app.delete("/api/cart", async (req: Request, res: Response) => {
    // Check session ID
    const sessionId = req.cookies?.cartSessionId;
    
    if (!sessionId) {
      return res.status(400).json({ message: "No cart session found" });
    }
    
    await storage.clearCart(sessionId);
    
    res.json({
      items: [],
      subtotal: 0,
      total: 0,
      count: 0
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
