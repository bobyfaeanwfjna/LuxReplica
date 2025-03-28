import { Icon } from "@/components/ui/icon";

interface ReviewStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

export default function ReviewStars({ rating, size = "sm" }: ReviewStarsProps) {
  // Calculate full, half, and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  const sizeClass = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }[size];
  
  return (
    <div className="flex items-center">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Icon key={`full-${i}`} name="star-fill" className={sizeClass} />
      ))}
      
      {hasHalfStar && <Icon name="star-half-fill" className={sizeClass} />}
      
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Icon key={`empty-${i}`} name="star-line" className={sizeClass} />
      ))}
    </div>
  );
}
