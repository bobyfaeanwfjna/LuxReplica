import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import ReviewStars from "@/components/ReviewStars";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/hooks/useCart";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  
  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: [`/api/products/${slug}`],
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="inline-block px-6 py-3 bg-black text-white uppercase tracking-wide text-sm">
          Return to Home
        </Link>
      </div>
    );
  }
  
  const mainImageUrl = selectedImage || 
    (product.images.find(img => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl);
  
  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedColor && product.colors.length > 0) {
      toast({
        title: "Please select a color",
        description: "You need to select a color before adding to cart",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const addToCartAsync = async () => {
        await addToCart(product.id, 1, selectedSize || undefined, selectedColor || undefined);
      };
      addToCartAsync();
      toast({
        title: "Success",
        description: "Item added to cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    }
  };
  
  return (
    <section className="py-16 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm flex items-center hover:underline">
            <Icon name="arrow-left" className="mr-1" /> Back to Products
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img 
                src={mainImageUrl} 
                alt={`${product.name} - Main View`} 
                className="w-full h-auto"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image) => (
                <div 
                  key={image.id}
                  className={`cursor-pointer border-2 ${
                    image.imageUrl === mainImageUrl ? 'border-black' : 'border-transparent hover:border-black'
                  }`}
                  onClick={() => setSelectedImage(image.imageUrl)}
                >
                  <img 
                    src={image.imageUrl} 
                    alt={`${product.name} - Thumbnail`} 
                    className="w-full h-24 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="font-serif text-2xl md:text-3xl mb-2">{product.name}</h1>
            <p className="text-[#666666] mb-4">Inspired by {product.inspirationBrand}</p>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                <ReviewStars rating={product.rating} />
                <span className="text-sm ml-1">({product.reviews.length} reviews)</span>
              </div>
              <span className="text-sm text-[#2E7D32]">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
            </div>
            
            <div className="mb-6">
              <span className="font-mono text-2xl">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-[#666666] text-sm ml-2 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-[#666666] mb-4">
                {product.description}
              </p>
              <div className="flex flex-col space-y-1 text-sm text-[#666666]">
                {product.material.split('\n').map((line, i) => (
                  <span key={i}>• {line}</span>
                ))}
              </div>
            </div>
            
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {product.sizes.map((size) => (
                    <button 
                      key={size.id}
                      className={`w-12 h-12 flex items-center justify-center border ${
                        !size.available 
                          ? 'border-[#E0E0E0] bg-[#F5F5F5] text-[#666666] cursor-not-allowed' 
                          : selectedSize === size.size
                            ? 'border-black bg-black text-white'
                            : 'border-[#E0E0E0] hover:border-black'
                      } text-sm`}
                      onClick={() => size.available && setSelectedSize(size.size)}
                      disabled={!size.available}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
                <Link href="/size-guide" className="text-sm underline">Size Guide</Link>
              </div>
            )}
            
            {product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex gap-3 mb-4">
                  {product.colors.map((color) => (
                    <button 
                      key={color.id}
                      className={`w-8 h-8 rounded-full bg-[${color.color}] ${
                        selectedColor === color.color 
                          ? 'border-2 border-black' 
                          : 'border border-[#E0E0E0]'
                      }`}
                      style={{ backgroundColor: color.color }}
                      onClick={() => setSelectedColor(color.color)}
                      title={color.colorName}
                      aria-label={`Select ${color.colorName} color`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="px-8 py-3 bg-black text-white uppercase tracking-wide text-sm hover:bg-[#333333] transition-colors flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="px-8 py-3 border border-black text-black uppercase tracking-wide text-sm hover:bg-black hover:text-white transition-colors flex-1">
                Add to Wishlist
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-[#E0E0E0]">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Icon name="secure-payment" className="text-xl" />
                  <span className="text-sm">Secure payment (Credit Card, PayPal, Crypto)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="truck" className="text-xl" />
                  <span className="text-sm">Free shipping on orders over $200</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="exchange" className="text-xl" />
                  <span className="text-sm">30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mt-16">
          <div className="border-b border-[#E0E0E0] mb-8">
            <div className="flex flex-wrap -mb-px">
              <button 
                className={`px-6 py-3 border-b-2 ${
                  activeTab === 'details' ? 'border-black' : 'border-transparent text-[#666666] hover:text-black'
                } text-sm uppercase tracking-wide`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button 
                className={`px-6 py-3 border-b-2 ${
                  activeTab === 'size-guide' ? 'border-black' : 'border-transparent text-[#666666] hover:text-black'
                } text-sm uppercase tracking-wide`}
                onClick={() => setActiveTab('size-guide')}
              >
                Size Guide
              </button>
              <button 
                className={`px-6 py-3 border-b-2 ${
                  activeTab === 'reviews' ? 'border-black' : 'border-transparent text-[#666666] hover:text-black'
                } text-sm uppercase tracking-wide`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({product.reviews.length})
              </button>
              <button 
                className={`px-6 py-3 border-b-2 ${
                  activeTab === 'shipping' ? 'border-black' : 'border-transparent text-[#666666] hover:text-black'
                } text-sm uppercase tracking-wide`}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping & Returns
              </button>
            </div>
          </div>
          
          <div>
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif text-xl mb-4">Product Details</h3>
                  <div className="text-[#666666] space-y-4">
                    {product.details.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                  <h4 className="font-medium mb-2 mt-6">Materials & Construction</h4>
                  <ul className="list-disc pl-5 text-[#666666] space-y-1">
                    {product.material.split('\n').map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-serif text-xl mb-4">Comparison with Authentic</h3>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Similarities</h4>
                    <ul className="list-disc pl-5 text-[#666666] space-y-1">
                      {product.comparison.split('\n\n')[0].split('\n').map((line, i) => {
                        // Skip the "Similarities include" prefix if present
                        const text = line.startsWith('Similarities include') 
                          ? line.replace('Similarities include', '').trim() 
                          : line;
                        return <li key={i}>{text}</li>;
                      })}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Differences</h4>
                    <ul className="list-disc pl-5 text-[#666666] space-y-1">
                      {product.comparison.split('\n\n')[1]?.split('\n').map((line, i) => {
                        // Skip the "Differences include" prefix if present
                        const text = line.startsWith('Differences include') 
                          ? line.replace('Differences include', '').trim() 
                          : line;
                        return <li key={i}>{text}</li>;
                      })}
                    </ul>
                  </div>
                  <div className="mt-6">
                    <img 
                      src={product.images[0]?.imageUrl} 
                      alt={`${product.name} - Detail`} 
                      className="w-full h-auto rounded"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'size-guide' && (
              <div className="max-w-3xl mx-auto">
                <h3 className="font-serif text-xl mb-6 text-center">Size Guide</h3>
                <p className="mb-6 text-[#666666]">
                  Please refer to the size chart below to find your perfect fit. Measurements are in inches.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#F5F5F5]">
                        <th className="p-3 text-left border border-[#E0E0E0]">Size</th>
                        <th className="p-3 text-left border border-[#E0E0E0]">Chest</th>
                        <th className="p-3 text-left border border-[#E0E0E0]">Waist</th>
                        <th className="p-3 text-left border border-[#E0E0E0]">Hip</th>
                        <th className="p-3 text-left border border-[#E0E0E0]">Inseam</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border border-[#E0E0E0] font-medium">XS</td>
                        <td className="p-3 border border-[#E0E0E0]">34-36"</td>
                        <td className="p-3 border border-[#E0E0E0]">28-30"</td>
                        <td className="p-3 border border-[#E0E0E0]">34-36"</td>
                        <td className="p-3 border border-[#E0E0E0]">30"</td>
                      </tr>
                      <tr className="bg-[#F5F5F5]">
                        <td className="p-3 border border-[#E0E0E0] font-medium">S</td>
                        <td className="p-3 border border-[#E0E0E0]">36-38"</td>
                        <td className="p-3 border border-[#E0E0E0]">30-32"</td>
                        <td className="p-3 border border-[#E0E0E0]">36-38"</td>
                        <td className="p-3 border border-[#E0E0E0]">31"</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-[#E0E0E0] font-medium">M</td>
                        <td className="p-3 border border-[#E0E0E0]">38-40"</td>
                        <td className="p-3 border border-[#E0E0E0]">32-34"</td>
                        <td className="p-3 border border-[#E0E0E0]">38-40"</td>
                        <td className="p-3 border border-[#E0E0E0]">32"</td>
                      </tr>
                      <tr className="bg-[#F5F5F5]">
                        <td className="p-3 border border-[#E0E0E0] font-medium">L</td>
                        <td className="p-3 border border-[#E0E0E0]">40-42"</td>
                        <td className="p-3 border border-[#E0E0E0]">34-36"</td>
                        <td className="p-3 border border-[#E0E0E0]">40-42"</td>
                        <td className="p-3 border border-[#E0E0E0]">33"</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-[#E0E0E0] font-medium">XL</td>
                        <td className="p-3 border border-[#E0E0E0]">42-44"</td>
                        <td className="p-3 border border-[#E0E0E0]">36-38"</td>
                        <td className="p-3 border border-[#E0E0E0]">42-44"</td>
                        <td className="p-3 border border-[#E0E0E0]">34"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-medium mb-4">How to Measure</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#666666]">
                    <div>
                      <p className="font-medium mb-1">Chest</p>
                      <p className="text-sm mb-3">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                      
                      <p className="font-medium mb-1">Waist</p>
                      <p className="text-sm mb-3">Measure around your natural waistline, keeping the tape comfortable.</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Hip</p>
                      <p className="text-sm mb-3">Measure around the fullest part of your hips, keeping the tape horizontal.</p>
                      
                      <p className="font-medium mb-1">Inseam</p>
                      <p className="text-sm">Measure from the crotch to the bottom of the leg.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="mt-6">
                <h3 className="font-serif text-2xl mb-6">Customer Reviews</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="col-span-1">
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <span className="text-3xl font-medium mr-2">{product.rating.toFixed(1)}</span>
                        <span className="text-sm text-[#666666]">out of 5</span>
                      </div>
                      <div className="flex mb-1">
                        <ReviewStars rating={product.rating} />
                      </div>
                      <p className="text-sm text-[#666666]">Based on {product.reviews.length} reviews</p>
                    </div>
                    
                    <div className="space-y-2">
                      {product.ratingBreakdown.map((rating) => (
                        <div key={rating.stars} className="flex items-center">
                          <div className="flex items-center w-16">
                            <span className="text-sm">{rating.stars} stars</span>
                          </div>
                          <div className="flex-1 h-2 bg-[#F5F5F5] mx-2">
                            <div 
                              className="h-2 bg-black" 
                              style={{ 
                                width: `${product.reviews.length > 0 
                                  ? (rating.count / product.reviews.length) * 100 
                                  : 0}%` 
                              }}
                            />
                          </div>
                          <div className="w-10 text-right">
                            <span className="text-sm text-[#666666]">{rating.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <button className="w-full px-4 py-2 border border-black text-black uppercase tracking-wide text-sm hover:bg-black hover:text-white transition-colors">
                        Write a Review
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="space-y-6">
                      {product.reviews.length === 0 ? (
                        <p className="text-[#666666] text-center py-8">
                          No reviews yet. Be the first to review this product!
                        </p>
                      ) : (
                        product.reviews.map((review, index) => (
                          <div key={review.id} className={`${index < product.reviews.length - 1 ? 'border-b border-[#E0E0E0]' : ''} pb-6`}>
                            <div className="flex items-center mb-2">
                              <div className="flex mr-2">
                                <ReviewStars rating={review.rating} />
                              </div>
                              <h4 className="font-medium">{review.title}</h4>
                            </div>
                            <p className="text-sm text-[#666666] mb-2">
                              {review.content}
                            </p>
                            <div className="flex items-center text-xs text-[#666666]">
                              <span className="font-medium">{review.authorName}</span>
                              <span className="mx-2">•</span>
                              <span>{review.verifiedPurchase ? 'Verified Purchase' : 'User Review'}</span>
                              <span className="mx-2">•</span>
                              <span>{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {product.reviews.length > 3 && (
                      <div className="mt-6 text-center">
                        <button className="px-6 py-2 text-sm border border-[#E0E0E0] hover:border-black">
                          Load More Reviews
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'shipping' && (
              <div className="max-w-3xl mx-auto">
                <h3 className="font-serif text-xl mb-6 text-center">Shipping & Returns</h3>
                
                <div className="mb-8">
                  <h4 className="font-medium text-lg mb-4">Shipping Policy</h4>
                  <div className="space-y-4 text-[#666666]">
                    <p>We offer worldwide shipping on all orders. Shipping times and costs vary based on location and shipping method selected at checkout.</p>
                    
                    <div className="border border-[#E0E0E0] rounded-md">
                      <div className="p-4 border-b border-[#E0E0E0] bg-[#F5F5F5] font-medium">
                        Shipping Methods & Estimated Delivery
                      </div>
                      <div className="p-4">
                        <table className="w-full">
                          <tbody>
                            <tr className="border-b border-[#E0E0E0]">
                              <td className="py-3 font-medium">Standard Shipping</td>
                              <td className="py-3">7-14 business days</td>
                              <td className="py-3">$9.99 (Free over $200)</td>
                            </tr>
                            <tr className="border-b border-[#E0E0E0]">
                              <td className="py-3 font-medium">Express Shipping</td>
                              <td className="py-3">3-5 business days</td>
                              <td className="py-3">$19.99</td>
                            </tr>
                            <tr>
                              <td className="py-3 font-medium">Priority Shipping</td>
                              <td className="py-3">1-3 business days</td>
                              <td className="py-3">$29.99</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <p>All orders are processed within 1-2 business days. Tracking information will be provided via email once your order ships.</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-lg mb-4">Return Policy</h4>
                  <div className="space-y-4 text-[#666666]">
                    <p>We offer a 30-day return policy for all unworn, unwashed items in their original condition with tags attached.</p>
                    
                    <div className="bg-[#F5F5F5] p-4 border-l-4 border-black">
                      <p className="font-medium mb-2">How to Return an Item:</p>
                      <ol className="list-decimal ml-5 space-y-1">
                        <li>Contact our customer service team to request a return authorization.</li>
                        <li>Package the item securely in its original packaging if possible.</li>
                        <li>Include the return authorization form in your package.</li>
                        <li>Ship the package using a trackable shipping method.</li>
                      </ol>
                    </div>
                    
                    <p>Once we receive and inspect your return, we'll process your refund or exchange. Refunds typically take 5-7 business days to appear on your statement.</p>
                    
                    <p>Please note that shipping costs are non-refundable, and return shipping costs are the responsibility of the customer unless the return is due to our error.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* You May Also Like */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="font-serif text-2xl mb-8 text-center">You May Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {product.relatedProducts.map(item => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  slug={item.slug}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  inspirationBrand={item.inspirationBrand}
                  imageUrl={item.image.imageUrl}
                  rating={item.rating}
                  reviewCount={item.reviewCount}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
