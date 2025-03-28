import {
  InsertCategory,
  InsertProduct,
  InsertProductImage,
  InsertProductSize,
  InsertProductColor,
  InsertReview,
  InsertCartItem,
  Category,
  Product,
  ProductImage,
  ProductSize,
  ProductColor,
  Review,
  CartItem,
  ProductWithDetails,
  CartItemWithProduct,
  products,
  users,
  type User,
  type InsertUser
} from "@shared/schema";

// Modify the interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product methods
  getProducts(filter?: { 
    categorySlug?: string; 
    featured?: boolean;
    newArrival?: boolean;
    bestSeller?: boolean;
    topRated?: boolean;
  }): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductWithDetails(slug: string): Promise<ProductWithDetails | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Product Images methods
  getProductImages(productId: number): Promise<ProductImage[]>;
  createProductImage(image: InsertProductImage): Promise<ProductImage>;
  
  // Product Sizes methods
  getProductSizes(productId: number): Promise<ProductSize[]>;
  createProductSize(size: InsertProductSize): Promise<ProductSize>;
  
  // Product Colors methods
  getProductColors(productId: number): Promise<ProductColor[]>;
  createProductColor(color: InsertProductColor): Promise<ProductColor>;
  
  // Review methods
  getReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Cart methods
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  getCartItem(id: number): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  deleteCartItem(id: number): Promise<void>;
  clearCart(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private productImages: Map<number, ProductImage>;
  private productSizes: Map<number, ProductSize>;
  private productColors: Map<number, ProductColor>;
  private reviews: Map<number, Review>;
  private cartItems: Map<number, CartItem>;
  
  private userId: number;
  private categoryId: number;
  private productId: number;
  private productImageId: number;
  private productSizeId: number;
  private productColorId: number;
  private reviewId: number;
  private cartItemId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.productImages = new Map();
    this.productSizes = new Map();
    this.productColors = new Map();
    this.reviews = new Map();
    this.cartItems = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.productId = 1;
    this.productImageId = 1;
    this.productSizeId = 1;
    this.productColorId = 1;
    this.reviewId = 1;
    this.cartItemId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // Product methods
  async getProducts(filter?: { 
    categorySlug?: string; 
    featured?: boolean;
    newArrival?: boolean;
    bestSeller?: boolean;
    topRated?: boolean;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (filter) {
      if (filter.categorySlug) {
        const category = await this.getCategoryBySlug(filter.categorySlug);
        if (category) {
          products = products.filter(p => p.categoryId === category.id);
        }
      }
      
      if (filter.featured !== undefined) {
        products = products.filter(p => p.featured === filter.featured);
      }
      
      if (filter.newArrival !== undefined) {
        products = products.filter(p => p.newArrival === filter.newArrival);
      }
      
      if (filter.bestSeller !== undefined) {
        products = products.filter(p => p.bestSeller === filter.bestSeller);
      }
      
      if (filter.topRated !== undefined) {
        products = products.filter(p => p.topRated === filter.topRated);
      }
    }
    
    return products;
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug,
    );
  }
  
  async getProductWithDetails(slug: string): Promise<ProductWithDetails | undefined> {
    const product = await this.getProductBySlug(slug);
    if (!product) return undefined;
    
    const images = await this.getProductImages(product.id);
    const sizes = await this.getProductSizes(product.id);
    const colors = await this.getProductColors(product.id);
    const reviews = await this.getReviews(product.id);
    const category = await this.getCategory(product.categoryId);
    
    if (!category) return undefined;
    
    return {
      ...product,
      images,
      sizes,
      colors,
      reviews,
      category,
    };
  }
  
  private async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  // Product Images methods
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return Array.from(this.productImages.values()).filter(
      (image) => image.productId === productId,
    );
  }
  
  async createProductImage(image: InsertProductImage): Promise<ProductImage> {
    const id = this.productImageId++;
    const newImage: ProductImage = { ...image, id };
    this.productImages.set(id, newImage);
    return newImage;
  }
  
  // Product Sizes methods
  async getProductSizes(productId: number): Promise<ProductSize[]> {
    return Array.from(this.productSizes.values()).filter(
      (size) => size.productId === productId,
    );
  }
  
  async createProductSize(size: InsertProductSize): Promise<ProductSize> {
    const id = this.productSizeId++;
    const newSize: ProductSize = { ...size, id };
    this.productSizes.set(id, newSize);
    return newSize;
  }
  
  // Product Colors methods
  async getProductColors(productId: number): Promise<ProductColor[]> {
    return Array.from(this.productColors.values()).filter(
      (color) => color.productId === productId,
    );
  }
  
  async createProductColor(color: InsertProductColor): Promise<ProductColor> {
    const id = this.productColorId++;
    const newColor: ProductColor = { ...color, id };
    this.productColors.set(id, newColor);
    return newColor;
  }
  
  // Review methods
  async getReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.productId === productId,
    );
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const newReview: Review = { ...review, id };
    this.reviews.set(id, newReview);
    return newReview;
  }
  
  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId,
    );
    
    const result: CartItemWithProduct[] = [];
    
    for (const item of items) {
      const product = await this.getProductById(item.productId);
      if (!product) continue;
      
      const images = await this.getProductImages(product.id);
      const primaryImage = images.find(img => img.isPrimary) || images[0];
      
      if (!primaryImage) continue;
      
      result.push({
        ...item,
        product,
        image: primaryImage,
      });
    }
    
    return result;
  }
  
  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }
  
  async createCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if the item already exists in the cart
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => 
        item.sessionId === cartItem.sessionId && 
        item.productId === cartItem.productId &&
        item.size === cartItem.size &&
        item.color === cartItem.color
    );
    
    if (existingItem) {
      // If it exists, update the quantity
      return this.updateCartItemQuantity(
        existingItem.id, 
        existingItem.quantity + (cartItem.quantity || 1)
      ) as Promise<CartItem>;
    }
    
    // Otherwise create a new item
    const id = this.cartItemId++;
    const newCartItem: CartItem = { ...cartItem, id };
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }
  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    if (quantity <= 0) {
      await this.deleteCartItem(id);
      return undefined;
    }
    
    const updatedItem: CartItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async deleteCartItem(id: number): Promise<void> {
    this.cartItems.delete(id);
  }
  
  async clearCart(sessionId: string): Promise<void> {
    const itemsToDelete = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId)
      .map(item => item.id);
    
    itemsToDelete.forEach(id => this.cartItems.delete(id));
  }

  private initializeData() {
    // Categories
    const categories = [
      { name: "Men", slug: "men", imageUrl: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
      { name: "Women", slug: "women", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
      { name: "Accessories", slug: "accessories", imageUrl: "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" }
    ];
    
    categories.forEach(category => {
      this.createCategory(category);
    });

    // Products
    const menCategory = this.getCategoryBySlug('men') as Promise<Category>;
    const womenCategory = this.getCategoryBySlug('women') as Promise<Category>;
    const accessoriesCategory = this.getCategoryBySlug('accessories') as Promise<Category>;

    // Create sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    const menCategory = await this.getCategoryBySlug('men');
    const womenCategory = await this.getCategoryBySlug('women');
    const accessoriesCategory = await this.getCategoryBySlug('accessories');

    if (!menCategory || !womenCategory || !accessoriesCategory) return;

    // Men's products
    const overcoat = await this.createProduct({
      name: "Premium Wool Overcoat",
      slug: "premium-wool-overcoat",
      description: "Our premium wool overcoat is meticulously crafted with high-quality materials and exceptional attention to detail. This classic piece features a timeless design with a modern fit.",
      price: 299,
      originalPrice: 499,
      inspirationBrand: "Burberry",
      inStock: true,
      categoryId: menCategory.id,
      details: "This premium overcoat is crafted from a luxury wool blend, featuring a classic silhouette with subtle modern updates. The tailored fit and clean lines create a sophisticated profile that transitions seamlessly from business to evening wear.",
      comparison: "Similarities include the premium wool composition, similar silhouette and cut, comparable button quality, and attention to detail in the stitching.\n\nDifferences include our version costs $299 vs. $1,500+ retail price, subtle difference in the lining pattern, and minor variations in the hardware.",
      material: "Outer: 80% Wool, 20% Cashmere\nLining: 100% Viscose\nButtons: Natural horn",
      featured: true,
      newArrival: false,
      bestSeller: true,
      topRated: true
    });

    await this.createProductImage({
      productId: overcoat.id,
      imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isPrimary: true
    });

    for (const size of ["S", "M", "L", "XL", "XXL"]) {
      await this.createProductSize({
        productId: overcoat.id,
        size,
        available: true
      });
    }

    for (const [color, colorName] of [["#000000", "Black"], ["#5F4B32", "Camel"], ["#7B7B7B", "Grey"]]) {
      await this.createProductColor({
        productId: overcoat.id,
        color,
        colorName
      });
    }

    await this.createReview({
      productId: overcoat.id,
      rating: 5,
      title: "Excellent quality coat",
      content: "This coat feels and looks like genuine luxury. The wool is soft yet substantial and the fit is perfect. I've received many compliments.",
      authorName: "James T.",
      verifiedPurchase: true,
      date: new Date("2023-03-15")
    });

    await this.createReview({
      productId: overcoat.id,
      rating: 4,
      title: "Almost perfect",
      content: "Beautiful coat with great quality. The only reason for 4 stars instead of 5 is that the sleeves run slightly long.",
      authorName: "Sarah K.",
      verifiedPurchase: true,
      date: new Date("2023-02-03")
    });

    // Women's product
    const crossbody = await this.createProduct({
      name: "Premium Leather Crossbody",
      slug: "premium-leather-crossbody",
      description: "Our premium leather crossbody bag is crafted with genuine calfskin leather and features meticulous stitching and a sleek gold-tone chain strap.",
      price: 199,
      originalPrice: 349,
      inspirationBrand: "Saint Laurent",
      inStock: true,
      categoryId: womenCategory.id,
      details: "This elegant crossbody bag is made from full-grain Italian leather with a soft, luxury finish. Featuring a distinctive flap closure with subtle brand-inspired elements, this versatile piece transitions seamlessly from day to night.",
      comparison: "Similarities include premium leather quality, identical hardware color and finish, similar interior organization, and comparable stitching precision.\n\nDifferences include our version costs $199 vs. $1,800+ retail price, subtle differences in logo placement, and slightly different dust bag design.",
      material: "Exterior: 100% Calfskin leather\nLining: Microfiber suede\nHardware: Gold-tone metal",
      featured: true,
      newArrival: true,
      bestSeller: true,
      topRated: false
    });

    await this.createProductImage({
      productId: crossbody.id,
      imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isPrimary: true
    });

    await this.createProductSize({
      productId: crossbody.id,
      size: "One Size",
      available: true
    });

    for (const [color, colorName] of [["#000000", "Black"], ["#800000", "Burgundy"], ["#C3B091", "Beige"]]) {
      await this.createProductColor({
        productId: crossbody.id,
        color,
        colorName
      });
    }

    await this.createReview({
      productId: crossbody.id,
      rating: 5,
      title: "Luxurious bag at amazing price",
      content: "I can't believe the quality of this bag for the price. Friends have asked if it's authentic YSL - the craftsmanship is that good.",
      authorName: "Michelle D.",
      verifiedPurchase: true,
      date: new Date("2023-04-10")
    });

    // Accessory product
    const sneakers = await this.createProduct({
      name: "Premium Leather Sneakers",
      slug: "premium-leather-sneakers",
      description: "Our premium leather sneakers are meticulously crafted with Italian calfskin leather and hand-stitched construction. These minimalist, versatile sneakers feature a sleek silhouette, durable rubber outsole, and premium comfort insole.",
      price: 179,
      originalPrice: 249,
      inspirationBrand: "Common Projects",
      inStock: true,
      categoryId: accessoriesCategory.id,
      details: "These premium sneakers are a meticulously crafted replica of the iconic Common Projects Achilles Low. Featuring the same minimalist design and sleek silhouette, our version is made with high-quality materials that provide exceptional comfort and durability at a fraction of the retail price.",
      comparison: "Similarities include identical silhouette and minimalist design, same high-quality Margom rubber sole, comparable leather quality and texture, matching gold serial number stamp, similar comfort and durability.\n\nDifferences include our version costs $179 vs. $425 retail price, subtle difference in the interior stamping, minor variations in the box and packaging.",
      material: "Upper: Full-grain Italian calfskin leather\nLining: Soft leather\nInsole: Padded leather\nOutsole: Margom rubber\nLaces: Waxed cotton",
      featured: true,
      newArrival: false,
      bestSeller: false,
      topRated: true
    });

    await this.createProductImage({
      productId: sneakers.id,
      imageUrl: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isPrimary: true
    });

    await this.createProductImage({
      productId: sneakers.id,
      imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      isPrimary: false
    });

    await this.createProductImage({
      productId: sneakers.id,
      imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      isPrimary: false
    });

    await this.createProductImage({
      productId: sneakers.id,
      imageUrl: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      isPrimary: false
    });

    for (const size of ["7", "8", "9", "10", "11", "12"]) {
      await this.createProductSize({
        productId: sneakers.id,
        size,
        available: size !== "12"
      });
    }

    for (const [color, colorName] of [["#FFFFFF", "White"], ["#000000", "Black"], ["#8B4513", "Brown"]]) {
      await this.createProductColor({
        productId: sneakers.id,
        color,
        colorName
      });
    }

    await this.createReview({
      productId: sneakers.id,
      rating: 5,
      title: "Excellent quality, incredible value",
      content: "I own the authentic Common Projects and these are remarkably close in quality. The leather is soft, the construction is excellent, and they look identical. For less than half the price, these are an incredible value. Highly recommended!",
      authorName: "James T.",
      verifiedPurchase: true,
      date: new Date("2023-03-15")
    });

    await this.createReview({
      productId: sneakers.id,
      rating: 4,
      title: "Great shoes, slight break-in period",
      content: "These look amazing and the quality is very good for the price. They took about a week to break in completely, but now they're very comfortable. Sizing is accurate, I ordered my usual size and they fit perfectly.",
      authorName: "Sarah K.",
      verifiedPurchase: true,
      date: new Date("2023-02-03")
    });

    await this.createReview({
      productId: sneakers.id,
      rating: 4,
      title: "Impressive quality, friends can't tell the difference",
      content: "I've had these for about 3 months now, and they've held up beautifully. The leather has developed a nice patina and they get more comfortable with wear. My friends who own the authentic ones couldn't tell the difference until I pointed it out.",
      authorName: "Michael R.",
      verifiedPurchase: true,
      date: new Date("2023-01-17")
    });

    // Additional products
    const sunglasses = await this.createProduct({
      name: "Premium Aviator Sunglasses",
      slug: "premium-aviator-sunglasses",
      description: "Our premium aviator sunglasses feature a classic, timeless design with polarized lenses and a durable metal frame.",
      price: 89,
      originalPrice: 129,
      inspirationBrand: "Ray-Ban",
      inStock: true,
      categoryId: accessoriesCategory.id,
      details: "These aviator sunglasses are crafted with precision to offer both style and functionality. The polarized lenses reduce glare and improve visual clarity, while the lightweight frame ensures comfort for all-day wear.",
      comparison: "Similarities include the classic aviator shape, similar weight and balance, comparable lens quality, and durable frame construction.\n\nDifferences include our version costs $89 vs. $200+ retail price, subtle differences in logo engraving, and slightly different case design.",
      material: "Frame: Metal alloy\nLenses: Polarized, 100% UV protection\nNose pads: Silicone",
      featured: true,
      newArrival: false,
      bestSeller: false,
      topRated: true
    });

    await this.createProductImage({
      productId: sunglasses.id,
      imageUrl: "https://images.unsplash.com/photo-1638394440667-aa54a7c0a703?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isPrimary: true
    });

    await this.createProductSize({
      productId: sunglasses.id,
      size: "One Size",
      available: true
    });

    for (const [color, colorName] of [["#000000", "Black/Green"], ["#964B00", "Brown/Brown"], ["#C0C0C0", "Silver/Blue"]]) {
      await this.createProductColor({
        productId: sunglasses.id,
        color,
        colorName
      });
    }

    const blazer = await this.createProduct({
      name: "Premium Tailored Blazer",
      slug: "premium-tailored-blazer",
      description: "Our premium tailored blazer offers sophisticated style with exceptional craftsmanship and attention to detail.",
      price: 249,
      originalPrice: 399,
      inspirationBrand: "Tom Ford",
      inStock: true,
      categoryId: menCategory.id,
      details: "This blazer features a sophisticated cut with structured shoulders and a slim, flattering silhouette. Crafted from premium Italian wool, it maintains its shape and offers breathable comfort for year-round wear.",
      comparison: "Similarities include the premium wool quality, comparable construction techniques, similar silhouette and lapel design, and attention to detail in the lining and pockets.\n\nDifferences include our version costs $249 vs. $3,000+ retail price, subtle differences in stitching details, and variations in the interior label design.",
      material: "Shell: 100% Italian wool\nLining: 100% Viscose\nButtons: Horn",
      featured: true,
      newArrival: false,
      bestSeller: false,
      topRated: false
    });

    await this.createProductImage({
      productId: blazer.id,
      imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isPrimary: true
    });

    for (const size of ["36", "38", "40", "42", "44", "46"]) {
      await this.createProductSize({
        productId: blazer.id,
        size,
        available: true
      });
    }

    for (const [color, colorName] of [["#000000", "Black"], ["#191970", "Navy"], ["#808080", "Grey"]]) {
      await this.createProductColor({
        productId: blazer.id,
        color,
        colorName
      });
    }

    const scarf = await this.createProduct({
      name: "Premium Silk Scarf",
      slug: "premium-silk-scarf",
      description: "Our premium silk scarf is crafted from 100% pure silk with hand-rolled edges and a luxurious hand feel.",
      price: 119,
      originalPrice: 179,
      inspirationBrand: "Hermès",
      inStock: true,
      categoryId: accessoriesCategory.id,
      details: "This exquisite silk scarf features a distinctive print inspired by classic designs, created with meticulous attention to detail. The premium silk twill provides a luxurious drape and beautiful sheen.",
      comparison: "Similarities include the premium silk quality, comparable print detail and color vibrancy, similar hand-rolled edge technique, and elegant drape.\n\nDifferences include our version costs $119 vs. $400+ retail price, subtle differences in the print design, and variations in the box packaging.",
      material: "100% Silk twill\nHand-rolled edges",
      featured: true,
      newArrival: false,
      bestSeller: false,
      topRated: true
    });

    await this.createProductImage({
      productId: scarf.id,
      imageUrl: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isPrimary: true
    });

    await this.createProductSize({
      productId: scarf.id,
      size: "One Size",
      available: true
    });

    for (const [color, colorName] of [["#C3B091", "Beige"], ["#000080", "Navy"], ["#800000", "Burgundy"]]) {
      await this.createProductColor({
        productId: scarf.id,
        color,
        colorName
      });
    }
  }
}

export const storage = new MemStorage();
