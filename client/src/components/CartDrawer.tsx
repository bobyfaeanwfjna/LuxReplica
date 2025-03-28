import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { Icon } from "@/components/ui/icon";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeItem, updateQuantity, isLoading } = useCart();
  
  // Handle escape key to close drawer
  useEffect(() => {
    function handleEscKeyPress(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    
    window.addEventListener('keydown', handleEscKeyPress);
    return () => window.removeEventListener('keydown', handleEscKeyPress);
  }, [isOpen, onClose]);
  
  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      <div 
        className={`absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-[#E0E0E0]">
            <h2 className="font-serif text-xl">
              Your Cart ({cart?.count || 0})
            </h2>
            <button className="text-black" onClick={onClose} aria-label="Close cart">
              <Icon name="close" className="text-xl" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
              </div>
            ) : cart?.items?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#666666]">
                <Icon name="shopping-bag" className="text-4xl mb-4" />
                <p className="mb-2">Your cart is empty</p>
                <button 
                  className="mt-4 px-6 py-2 text-sm uppercase border border-black hover:bg-black hover:text-white transition-colors"
                  onClick={onClose}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {cart?.items.map(item => (
                  <div key={item.id} className="flex py-4 border-b border-[#E0E0E0]">
                    <img 
                      src={item.image.imageUrl} 
                      alt={item.product.name} 
                      className="w-20 h-20 object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-sm">{item.product.name}</h3>
                          <p className="text-[#666666] text-xs">
                            {item.color ? `${item.color} / ` : ''}
                            {item.size || 'One Size'}
                          </p>
                        </div>
                        <button 
                          className="text-[#666666] hover:text-black"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                        >
                          <Icon name="delete-bin" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center border border-[#E0E0E0]">
                          <button 
                            className="px-2 py-1 text-sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-2 py-1 text-sm">{item.quantity}</span>
                          <button 
                            className="px-2 py-1 text-sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-mono">
                          ${item.product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          
          {cart?.items?.length > 0 && (
            <div className="p-4 border-t border-[#E0E0E0]">
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-mono">${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="font-mono">Calculated at checkout</span>
                </div>
              </div>
              <div className="flex justify-between font-medium mb-4">
                <span>Total</span>
                <span className="font-mono">${cart.total.toFixed(2)}</span>
              </div>
              <button className="w-full py-3 bg-black text-white uppercase tracking-wide text-sm hover:bg-[#333333] transition-colors mb-3">
                Checkout
              </button>
              <button 
                className="w-full py-3 border border-black text-black uppercase tracking-wide text-sm hover:bg-black hover:text-white transition-colors" 
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
