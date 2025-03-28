import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import CategoryCard from "@/components/CategoryCard";
import ProductGrid from "@/components/ProductGrid";
import { Icon } from "@/components/ui/icon";

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  // Fetch products with filter
  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ["/api/products", { filter: activeFilter !== "all" ? activeFilter : undefined }],
  });
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Luxury fashion model in premium clothing" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white font-medium mb-4">(change later title quote)</h1>
            <p className="text-white text-base md:text-lg mb-8 max-w-2xl mx-auto">(change later subtitle)</p>
            <Link href="#featured-products" className="inline-block bg-white text-black px-8 py-3 uppercase tracking-wide text-sm hover:bg-gray-100 transition-colors">
              Shop Now
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto">
          <h2 className="font-sans text-2xl md:text-3xl mb-8 text-center">Shop by Category</h2>
          
          {isCategoriesLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories?.map(category => (
                <CategoryCard 
                  key={category.id}
                  name={category.name}
                  slug={category.slug}
                  imageUrl={category.imageUrl}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Products */}
      <section id="featured-products">
        {isProductsLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
          </div>
        ) : (
          <ProductGrid
            products={products || []}
            title="Featured Products"
            description="(change later featured products description)"
            showFilters={true}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        )}
      </section>
      
      {/* Features */}
      <section className="py-16 px-4 md:px-6 bg-[#F5F5F5]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Icon name="verified-badge" className="text-4xl" />
              </div>
              <h3 className="font-serif text-xl mb-3">Premium Quality</h3>
              <p className="text-[#666666]">
                Meticulously crafted replicas using high-quality materials and precise craftsmanship for products 
                that look and feel like the authentic items.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Icon name="secure-payment" className="text-4xl" />
              </div>
              <h3 className="font-serif text-xl mb-3">Secure Shopping</h3>
              <p className="text-[#666666]">
                Shop with confidence with our secure payment options, discreet packaging, and 
                encrypted transactions that protect your privacy.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Icon name="customer-service-2" className="text-4xl" />
              </div>
              <h3 className="font-serif text-xl mb-3">Dedicated Support</h3>
              <p className="text-[#666666]">
                Our knowledgeable customer service team is available to assist with product questions, 
                sizing recommendations, and order inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">Join Our Community</h2>
          <p className="mb-8 text-[#E0E0E0]">
            Subscribe to our newsletter for exclusive access to new arrivals, special offers, and styling tips.
          </p>
          <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3 bg-[#333333] border-none text-white placeholder-[#666666] focus:ring-1 focus:ring-white"
              required
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-white text-black uppercase tracking-wide text-sm hover:bg-[#F5F5F5] transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-xs text-[#E0E0E0]">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </section>
    </>
  );
}
