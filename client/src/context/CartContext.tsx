import { createContext, ReactNode, useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
  product: {
    id: number;
    name: string;
    price: number;
    slug: string;
  };
  image: {
    imageUrl: string;
  };
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
  count: number;
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (productId: number, quantity: number, size?: string, color?: string) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
}

export const CartContext = createContext<CartContextType>({
  cart: null,
  isLoading: false,
  addToCart: async () => {},
  removeItem: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  itemCount: 0,
});

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch cart data
  useEffect(() => {
    async function fetchCart() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/cart", {
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }

        const cartData = await response.json();
        setCart(cartData);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast({
          title: "Error",
          description: "Failed to load your cart. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchCart();
  }, [toast]);

  const addToCart = async (
    productId: number, 
    quantity: number, 
    size?: string, 
    color?: string
  ) => {
    try {
      setIsLoading(true);

      const response = await apiRequest("POST", "/api/cart", {
        productId,
        quantity,
        size,
        color
      },{credentials: "include"}); //Added credentials here

      const updatedCart = await response.json();
      setCart(updatedCart);

      toast({
        title: "Added to cart",
        description: "Product successfully added to your cart.",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      setIsLoading(true);

      const response = await apiRequest("DELETE", `/api/cart/${itemId}`, undefined,{credentials: "include"}); //Added credentials here

      const updatedCart = await response.json();
      setCart(updatedCart);

      toast({
        title: "Removed from cart",
        description: "Product successfully removed from your cart.",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove product from cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setIsLoading(true);

      const response = await apiRequest("PUT", `/api/cart/${itemId}`, { quantity },{credentials: "include"}); //Added credentials here

      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);

      const response = await apiRequest("DELETE", "/api/cart", undefined,{credentials: "include"}); //Added credentials here

      const updatedCart = await response.json();
      setCart(updatedCart);

      toast({
        title: "Cart cleared",
        description: "Your cart has been cleared.",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount: cart?.count || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}