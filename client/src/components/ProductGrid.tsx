import { useState } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  inspirationBrand: string;
  image: {
    imageUrl: string;
  };
  rating: number;
  reviewCount: number;
}

interface ProductGridProps {
  products: Product[];
  title?: string;
  description?: string;
  showFilters?: boolean;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export default function ProductGrid({
  products,
  title,
  description,
  showFilters = false,
  activeFilter = "all",
  onFilterChange
}: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  return (
    <section className="py-16 px-4 md:px-6 bg-[#F5F5F5]">
      <div className="container mx-auto">
        {title && (
          <h2 className="font-serif text-2xl md:text-3xl mb-4 text-center">{title}</h2>
        )}
        
        {description && (
          <p className="text-[#666666] text-center mb-8 max-w-2xl mx-auto">{description}</p>
        )}
        
        {showFilters && (
          <div className="flex flex-wrap items-center justify-center mb-8 gap-2">
            <button 
              className={`px-4 py-2 text-sm ${activeFilter === 'all' 
                ? 'bg-black text-white' 
                : 'bg-white border border-[#E0E0E0] text-black hover:bg-[#F5F5F5]'} 
                uppercase tracking-wide`}
              onClick={() => onFilterChange?.('all')}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 text-sm ${activeFilter === 'new' 
                ? 'bg-black text-white' 
                : 'bg-white border border-[#E0E0E0] text-black hover:bg-[#F5F5F5]'} 
                uppercase tracking-wide`}
              onClick={() => onFilterChange?.('new')}
            >
              New Arrivals
            </button>
            <button 
              className={`px-4 py-2 text-sm ${activeFilter === 'bestsellers' 
                ? 'bg-black text-white' 
                : 'bg-white border border-[#E0E0E0] text-black hover:bg-[#F5F5F5]'} 
                uppercase tracking-wide`}
              onClick={() => onFilterChange?.('bestsellers')}
            >
              Best Sellers
            </button>
            <button 
              className={`px-4 py-2 text-sm ${activeFilter === 'toprated' 
                ? 'bg-black text-white' 
                : 'bg-white border border-[#E0E0E0] text-black hover:bg-[#F5F5F5]'} 
                uppercase tracking-wide`}
              onClick={() => onFilterChange?.('toprated')}
            >
              Top Rated
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              description={product.description}
              price={product.price}
              originalPrice={product.originalPrice}
              inspirationBrand={product.inspirationBrand}
              imageUrl={product.image.imageUrl}
              rating={product.rating}
              reviewCount={product.reviewCount}
              onQuickView={() => setQuickViewProduct(product)}
            />
          ))}
        </div>
        
        {products.length >= 6 && (
          <div className="mt-12 text-center">
            <a href="#" className="inline-block px-8 py-3 border border-black text-black uppercase tracking-wide text-sm hover:bg-black hover:text-white transition-colors">
              View All Products
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
