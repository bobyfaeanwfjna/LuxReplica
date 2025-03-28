import { Link } from "wouter";

interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl: string;
}

export default function CategoryCard({ name, slug, imageUrl }: CategoryCardProps) {
  return (
    <div className="relative group h-80 overflow-hidden">
      <img 
        src={imageUrl} 
        alt={`${name} collection`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-white text-xl font-medium mb-3">{name}</h3>
          <Link 
            href={`/category/${slug}`}
            className="inline-block bg-white text-black px-4 py-2 text-sm uppercase tracking-wide hover:bg-gray-100"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
