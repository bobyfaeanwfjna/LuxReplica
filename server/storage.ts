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
  CartItemWithProduct
} from "@shared/schema";

// Define User types since they're not in shared schema
interface User {
  id: number;
  username: string;
  password: string;
  email: string;
}

interface InsertUser {
  username: string;
  password: string;
  email: string;
}

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
      { name: "Sp5der", slug: "sp5der", imageUrl: "/images/sp5der-category.png" },
      { name: "Hellstar", slug: "hellstar", imageUrl: "/images/hellstar-category.png" },
      { name: "Denim Tears", slug: "denim-tears", imageUrl: "/images/denim-tears-category.png" }
    ];
    
    categories.forEach(category => {
      this.createCategory(category);
    });

    // Products
    const sp5derCategory = this.getCategoryBySlug('sp5der') as Promise<Category>;
    const hellstarCategory = this.getCategoryBySlug('hellstar') as Promise<Category>;
    const denimTearsCategory = this.getCategoryBySlug('denim-tears') as Promise<Category>;

    // Create sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    const sp5derCategory = await this.getCategoryBySlug('sp5der');
    const hellstarCategory = await this.getCategoryBySlug('hellstar');
    const denimTearsCategory = await this.getCategoryBySlug('denim-tears');

    if (!sp5derCategory || !hellstarCategory || !denimTearsCategory) return;

    // SP5DER PRODUCTS
    // 1. SP5DER Hoodie
    const sp5derHoodie = await this.createProduct({
      name: "SP5DER Hoodie",
      slug: "sp5der-hoodie",
      description: "Authentic SP5DER hoodie available in the sought-after Sand Beluga and limited Pink V2 colorways. Features the iconic spider web design on the front and back. Made with premium cotton blend for exceptional comfort and streetwear style.",
      price: 149,
      originalPrice: 199,
      inspirationBrand: "SP5DER",
      inStock: true,
      categoryId: sp5derCategory.id,
      details: "The SP5DER hoodie showcases the brand's signature web pattern design in two exclusive colorways. The Sand Beluga features a neutral tone with clean white logo print, while the Pink V2 showcases a bold black base with vibrant pink logo and star accents. Each hoodie is crafted from high-quality cotton blend fabric with a soft interior lining for ultimate comfort and warmth. Features include an adjustable drawstring hood, ribbed cuffs and hem, and a front kangaroo pocket.",
      comparison: "These are authentic SP5DER hoodies with the genuine spider web design in the rare Sand Beluga and Pink V2 color variants.",
      material: "80% Cotton, 20% Polyester\nMachine washable\nImported",
      featured: true,
      newArrival: true,
      bestSeller: true,
      topRated: true
    });

    await this.createProductImage({
      productId: sp5derHoodie.id,
      imageUrl: "/images/sp5der-hoodie-sand-beluga.png",
      isPrimary: true
    });
    
    await this.createProductImage({
      productId: sp5derHoodie.id,
      imageUrl: "/images/sp5der-hoodie-pink-v2.png",
      isPrimary: false
    });

    for (const size of ["S", "M", "L", "XL", "XXL"]) {
      await this.createProductSize({
        productId: sp5derHoodie.id,
        size,
        available: true
      });
    }

    for (const [color, colorName] of [["#9B8579", "Sand Beluga"], ["#F4B8C5", "Pink V2"], ["#000000", "Black"]]) {
      await this.createProductColor({
        productId: sp5derHoodie.id,
        color,
        colorName
      });
    }

    await this.createReview({
      productId: sp5derHoodie.id,
      rating: 5,
      title: "Excellent quality hoodie",
      content: "The Pink V2 colorway is amazing! The material is super soft and the design is clean. The vibrant pink really pops against the black. Fits perfectly and looks exactly like the photos online.",
      authorName: "Marcus J.",
      verifiedPurchase: true,
      date: new Date("2023-10-15")
    });
    
    await this.createReview({
      productId: sp5derHoodie.id,
      rating: 5,
      title: "Rare Sand Beluga colorway",
      content: "Finally got my hands on the Sand Beluga hoodie. The neutral color is perfect for everyday wear and the quality is top-notch. Love how it pairs with literally everything in my wardrobe.",
      authorName: "Alyssa K.",
      verifiedPurchase: true,
      date: new Date("2023-11-02")
    });

    // 2. SP5DER T-Shirt
    const sp5derTshirt = await this.createProduct({
      name: "SP5DER T-Shirt - NOT IN HAND",
      slug: "sp5der-tshirt",
      description: "Authentic SP5DER t-shirt with the iconic spider web logo. Available in Black, Brown, and Navy colorways with unique web designs. Premium cotton construction for everyday comfort and style. NOT IN HAND - SIGN UP FOR RESTOCK NOTIFICATIONS.",
      price: 79,
      originalPrice: 99,
      inspirationBrand: "SP5DER",
      inStock: false,
      categoryId: sp5derCategory.id,
      details: "The SP5DER t-shirt features the brand's signature spider web design printed on high-quality cotton fabric. Available in multiple colorways: Black with purple web, Brown with yellow web, and Navy with teal web and heart graphic. Each shirt has a modern fit with a crew neckline and short sleeves, making it perfect for everyday wear or as a statement piece in your streetwear collection. NOT IN HAND - SIGN UP FOR RESTOCK NOTIFICATIONS.",
      comparison: "This is an authentic SP5DER t-shirt with the genuine spider web design and branding.",
      material: "100% Cotton\nMachine washable\nImported",
      featured: true,
      newArrival: false,
      bestSeller: true,
      topRated: true
    });

    // Add primary black t-shirt image
    await this.createProductImage({
      productId: sp5derTshirt.id,
      imageUrl: "/images/sp5der-tshirt-black.png",
      isPrimary: true
    });
    
    // Add brown t-shirt image
    await this.createProductImage({
      productId: sp5derTshirt.id,
      imageUrl: "/images/sp5der-tshirt-brown.png",
      isPrimary: false
    });
    
    // Add navy t-shirt image
    await this.createProductImage({
      productId: sp5derTshirt.id,
      imageUrl: "/images/sp5der-tshirt-navy.png",
      isPrimary: false
    });

    for (const size of ["S", "M", "L", "XL", "XXL"]) {
      await this.createProductSize({
        productId: sp5derTshirt.id,
        size,
        available: false
      });
    }

    for (const [color, colorName] of [["#000000", "Black"], ["#654321", "Brown"], ["#000080", "Navy"]]) {
      await this.createProductColor({
        productId: sp5derTshirt.id,
        color,
        colorName
      });
    }
    
    // Add reviews for the different colorways
    await this.createReview({
      productId: sp5derTshirt.id,
      rating: 5,
      title: "Black colorway is fire",
      content: "The black t-shirt with purple web design is so clean. Perfect statement piece that goes with everything. Can't wait for these to be back in stock!",
      authorName: "Jason M.",
      verifiedPurchase: true,
      date: new Date("2023-09-15")
    });
    
    await this.createReview({
      productId: sp5derTshirt.id,
      rating: 5,
      title: "Brown is underrated",
      content: "The brown tee with yellow web print is my favorite. Such a unique color combo that stands out from the usual black options. Material quality is top-tier.",
      authorName: "Sophia K.",
      verifiedPurchase: true,
      date: new Date("2023-10-03")
    });
    
    await this.createReview({
      productId: sp5derTshirt.id,
      rating: 5,
      title: "Navy with heart design is unique",
      content: "The navy 'I ♥ SP5DER' t-shirt is my absolute favorite. The teal web design with pink heart makes it stand out from all my other SP5DER pieces. Perfect fit too.",
      authorName: "Ethan L.",
      verifiedPurchase: true,
      date: new Date("2023-08-22")
    });

    // HELLSTAR PRODUCTS
    // 1. Hellstar Hoodie
    const hellstarHoodie = await this.createProduct({
      name: "Hellstar Hoodie",
      slug: "hellstar-hoodie",
      description: "Authentic Hellstar hoodie featuring the iconic pentagram and stars design. Premium quality streetwear with unique gothic aesthetic.",
      price: 159,
      originalPrice: 209,
      inspirationBrand: "Hellstar",
      inStock: true,
      categoryId: hellstarCategory.id,
      details: "The Hellstar hoodie showcases the brand's distinctive pentagram and star motifs that have made it a standout in contemporary streetwear. This premium hoodie is crafted with a heavyweight cotton blend for durability and comfort, featuring a relaxed fit, adjustable hood, and kangaroo pocket.",
      comparison: "This is an authentic Hellstar hoodie with the brand's signature gothic designs and premium construction.",
      material: "80% Cotton, 20% Polyester\nHeavyweight fabric\nMachine washable",
      featured: true,
      newArrival: true,
      bestSeller: false,
      topRated: true
    });

    await this.createProductImage({
      productId: hellstarHoodie.id,
      imageUrl: "/images/hellstar-tshirt.png",
      isPrimary: true
    });

    for (const size of ["S", "M", "L", "XL", "XXL"]) {
      await this.createProductSize({
        productId: hellstarHoodie.id,
        size,
        available: true
      });
    }

    for (const [color, colorName] of [["#000000", "Black"], ["#FF0000", "Red"], ["#800080", "Purple"]]) {
      await this.createProductColor({
        productId: hellstarHoodie.id,
        color,
        colorName
      });
    }

    await this.createReview({
      productId: hellstarHoodie.id,
      rating: 5,
      title: "Best hoodie I own",
      content: "The quality is unmatched - thick material, perfect print, and super comfortable. I get compliments every time I wear it.",
      authorName: "Alex T.",
      verifiedPurchase: true,
      date: new Date("2023-11-05")
    });

    // 2. Hellstar Cargo Pants
    const hellstarPants = await this.createProduct({
      name: "Hellstar Cargo Pants",
      slug: "hellstar-cargo-pants",
      description: "Authentic Hellstar cargo pants with signature embroidered details and multiple pockets. Durable construction with a modern fit.",
      price: 129,
      originalPrice: 169,
      inspirationBrand: "Hellstar",
      inStock: true,
      categoryId: hellstarCategory.id,
      details: "These Hellstar cargo pants feature the brand's signature embroidered details and an array of functional pockets. Constructed from durable cotton with a slight stretch for comfort, these pants offer both style and utility with their relaxed fit and distinctive streetwear aesthetic.",
      comparison: "These are authentic Hellstar cargo pants with genuine embroidery and design elements.",
      material: "98% Cotton, 2% Elastane\nDurable twill construction\nMachine washable",
      featured: true,
      newArrival: true,
      bestSeller: true,
      topRated: false
    });

    await this.createProductImage({
      productId: hellstarPants.id,
      imageUrl: "/images/hellstar-pants.png",
      isPrimary: true
    });

    for (const size of ["30", "32", "34", "36", "38"]) {
      await this.createProductSize({
        productId: hellstarPants.id,
        size,
        available: true
      });
    }

    for (const [color, colorName] of [["#000000", "Black"], ["#808080", "Grey"], ["#5D4037", "Brown"]]) {
      await this.createProductColor({
        productId: hellstarPants.id,
        color,
        colorName
      });
    }

    // DENIM TEARS PRODUCTS
    // 1. Denim Tears Cotton Wreath Jeans
    const denimTearsJeans = await this.createProduct({
      name: "Cotton Wreath Jeans",
      slug: "denim-tears-cotton-wreath-jeans",
      description: "Authentic Denim Tears jeans featuring the iconic cotton wreath print. Premium denim with a classic straight-leg fit.",
      price: 189,
      originalPrice: 249,
      inspirationBrand: "Denim Tears",
      inStock: true,
      categoryId: denimTearsCategory.id,
      details: "These Denim Tears jeans feature the brand's iconic cotton wreath print, a powerful symbol that has become synonymous with the label. Crafted from premium denim with a classic straight-leg fit, these jeans combine cultural significance with everyday wearability.",
      comparison: "These are authentic Denim Tears jeans with the genuine cotton wreath design and premium construction.",
      material: "100% Cotton denim\nRigid construction\nMade in USA",
      featured: true,
      newArrival: true,
      bestSeller: true,
      topRated: true
    });

    await this.createProductImage({
      productId: denimTearsJeans.id,
      imageUrl: "/images/denim-tears-jeans.png",
      isPrimary: true
    });

    for (const size of ["30", "32", "34", "36", "38"]) {
      await this.createProductSize({
        productId: denimTearsJeans.id,
        size,
        available: true
      });
    }

    for (const [color, colorName] of [["#0000FF", "Blue"], ["#000000", "Black"], ["#FFFFFF", "White"]]) {
      await this.createProductColor({
        productId: denimTearsJeans.id,
        color,
        colorName
      });
    }

    await this.createReview({
      productId: denimTearsJeans.id,
      rating: 5,
      title: "Cultural statement piece",
      content: "Not only are these jeans incredibly well-made, but the cotton wreath symbolism makes them a powerful cultural statement. The fit is perfect and the denim quality is exceptional.",
      authorName: "Derek W.",
      verifiedPurchase: true,
      date: new Date("2023-09-20")
    });

    // 2. Denim Tears Cotton Wreath Hoodie
    const denimTearsHoodie = await this.createProduct({
      name: "Cotton Wreath Hoodie",
      slug: "denim-tears-cotton-wreath-hoodie",
      description: "Authentic Denim Tears hoodie featuring the symbolic cotton wreath design. Premium heavyweight cotton with a comfortable fit.",
      price: 169,
      originalPrice: 219,
      inspirationBrand: "Denim Tears",
      inStock: true,
      categoryId: denimTearsCategory.id,
      details: "This Denim Tears hoodie showcases the brand's signature cotton wreath design, a symbol rich with historical and cultural significance. Made from premium heavyweight cotton, this hoodie offers exceptional comfort with its relaxed fit and soft interior lining.",
      comparison: "This is an authentic Denim Tears hoodie with the genuine cotton wreath design and premium quality construction.",
      material: "100% Cotton\nHeavyweight 14oz fabric\nMachine washable\nMade in USA",
      featured: true,
      newArrival: false,
      bestSeller: true,
      topRated: true
    });

    await this.createProductImage({
      productId: denimTearsHoodie.id,
      imageUrl: "/images/denim-tears-hoodie.png",
      isPrimary: true
    });

    for (const size of ["S", "M", "L", "XL", "XXL"]) {
      await this.createProductSize({
        productId: denimTearsHoodie.id,
        size,
        available: true
      });
    }

    for (const [color, colorName] of [["#000000", "Black"], ["#FFFFFF", "White"], ["#A52A2A", "Brown"]]) {
      await this.createProductColor({
        productId: denimTearsHoodie.id,
        color,
        colorName
      });
    }

    await this.createReview({
      productId: denimTearsHoodie.id,
      rating: 5,
      title: "Meaningful and comfortable",
      content: "The cotton wreath design is beautifully executed and the hoodie itself is incredibly comfortable. Heavy fabric that feels like it will last for years.",
      authorName: "Monica L.",
      verifiedPurchase: true,
      date: new Date("2023-08-12")
    });
  }
}

export const storage = new MemStorage();
