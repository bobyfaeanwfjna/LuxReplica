import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import ProductGrid from "@/components/ProductGrid";
import { Icon } from "@/components/ui/icon";

export default function CategoryPage() {
  const { slug } = useParams();
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Fetch category
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  const category = categories?.find(c => c.slug === slug);
  
  // Fetch products by category with filter
  const { data: products, isLoading } = useQuery({
    queryKey: [
      "/api/products", 
      { 
        category: slug,
        filter: activeFilter !== "all" ? activeFilter : undefined
      }
    ],
  });
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
      </div>
    );
  }
  
  // Handle unknown category
  if (slug !== "new" && slug !== "bestsellers" && slug !== "sale" && slug !== "collections" && !category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-serif mb-4">Category Not Found</h1>
        <p className="mb-6">The category you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="inline-block px-6 py-3 bg-black text-white uppercase tracking-wide text-sm">
          Return to Home
        </Link>
      </div>
    );
  }
  
  let title = category?.name || "";
  
  // Handle special categories
  if (slug === "new") title = "New Arrivals";
  if (slug === "bestsellers") title = "Best Sellers";
  if (slug === "sale") title = "Sale Items";
  if (slug === "collections") title = "Collections";
  
  return (
    <>
      {/* Category Header */}
      <div className="bg-[#F5F5F5] py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-serif text-3xl md:text-4xl mb-4">{title}</h1>
          <nav className="flex justify-center text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:underline">Home</Link>
              </li>
              <li className="flex items-center space-x-2">
                <span><Icon name="arrow-right-s" className="text-[#666666]" /></span>
                <span>{title}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Products */}
      <ProductGrid
        products={products || []}
        showFilters={true}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />
    </>
  );
}
