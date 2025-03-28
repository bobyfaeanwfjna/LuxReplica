import { useState } from "react";
import { Link } from "wouter";
import ReviewStars from "./ReviewStars";

interface ProductCardProps {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  inspirationBrand: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  onQuickView?: () => void;
}

export default function ProductCard({
  id,
  slug,
  name,
  description,
  price,
  originalPrice,
  inspirationBrand,
  imageUrl,
  rating,
  reviewCount,
  onQuickView
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="product-card group bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <Link href={`/product/${slug}`}>
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-80 object-cover transition-opacity duration-300"
            style={{ opacity: isHovered ? 0.9 : 1 }}
          />
        </Link>
        {onQuickView && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            <button 
              className="px-4 py-2 bg-white text-black text-sm uppercase tracking-wide hover:bg-gray-100"
              onClick={onQuickView}
            >
              Quick View
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <Link href={`/product/${slug}`}>
          <h3 className="font-medium text-base">{name}</h3>
        </Link>
        <p className="text-[#666666] text-sm mb-2">Inspired by {inspirationBrand}</p>
        <div className="flex items-center justify-between">
          <span className="font-mono">
            ${price.toFixed(2)}
            {originalPrice && (
              <span className="text-[#666666] text-sm ml-2 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </span>
          <div className="flex items-center">
            <ReviewStars rating={rating} />
            <span className="text-xs ml-1">({reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
