import { Link } from "wouter";
import { Icon } from "@/components/ui/icon";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white py-12 px-4 md:px-6 border-t border-[#E0E0E0]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-lg mb-4">REPLICA</h3>
            <p className="text-[#666666] text-sm mb-4">
              Premium quality replicas of luxury fashion items at a fraction of the retail price.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-black hover:text-[#666666]" aria-label="Instagram">
                <Icon name="instagram" />
              </a>
              <a href="#" className="text-black hover:text-[#666666]" aria-label="Pinterest">
                <Icon name="pinterest" />
              </a>
              <a href="#" className="text-black hover:text-[#666666]" aria-label="Twitter">
                <Icon name="twitter" />
              </a>
              <a href="#" className="text-black hover:text-[#666666]" aria-label="Facebook">
                <Icon name="facebook" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="uppercase text-sm font-medium mb-4">Shopping</h4>
            <ul className="space-y-2 text-[#666666] text-sm">
              <li><Link href="/category/new" className="hover:text-black">New Arrivals</Link></li>
              <li><Link href="/category/men" className="hover:text-black">Men's Collection</Link></li>
              <li><Link href="/category/women" className="hover:text-black">Women's Collection</Link></li>
              <li><Link href="/category/accessories" className="hover:text-black">Accessories</Link></li>
              <li><Link href="/category/sale" className="hover:text-black">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="uppercase text-sm font-medium mb-4">Information</h4>
            <ul className="space-y-2 text-[#666666] text-sm">
              <li><Link href="/about" className="hover:text-black">About Us</Link></li>
              <li><Link href="/shipping" className="hover:text-black">Shipping & Returns</Link></li>
              <li><Link href="/faq" className="hover:text-black">FAQ</Link></li>
              <li><Link href="/size-guide" className="hover:text-black">Size Guide</Link></li>
              <li><Link href="/contact" className="hover:text-black">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="uppercase text-sm font-medium mb-4">Payment & Shipping</h4>
            <ul className="space-y-2 text-[#666666] text-sm">
              <li><Link href="/payment" className="hover:text-black">Payment Methods</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-black">Shipping Policies</Link></li>
              <li><Link href="/track-order" className="hover:text-black">Track Your Order</Link></li>
              <li><Link href="/crypto" className="hover:text-black">Crypto Payments</Link></li>
              <li><Link href="/loyalty" className="hover:text-black">Loyalty Program</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-[#E0E0E0] flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#666666] text-sm mb-4 md:mb-0">
            © {currentYear} REPLICA. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Icon name="visa" className="text-xl" />
            <Icon name="mastercard" className="text-xl" />
            <Icon name="paypal" className="text-xl" />
            <Icon name="apple-pay" className="text-xl" />
            <Icon name="bitcoin" className="text-xl" />
          </div>
        </div>
      </div>
    </footer>
  );
}
