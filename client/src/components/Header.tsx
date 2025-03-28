import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/useCart";
import { Icon } from "@/components/ui/icon";

interface HeaderProps {
  onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const [location] = useLocation();

  const navLinks = [
    { label: "New", path: "/category/new" },
    { label: "Men", path: "/category/men" },
    { label: "Women", path: "/category/women" },
    { label: "Accessories", path: "/category/accessories" },
    { label: "Collections", path: "/category/collections" },
  ];

  return (
    <header className="sticky top-0 bg-white z-50 border-b border-[#E0E0E0]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
            REPLICA
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`text-sm uppercase tracking-wide hover:underline ${
                  location === link.path ? "font-medium" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <Icon name="menu" className="text-xl" />
          </button>
          
          {/* User Actions */}
          <div className="flex items-center space-x-6">
            <button 
              className="hidden md:block text-sm uppercase tracking-wide hover:underline"
              aria-label="Search"
            >
              Search
            </button>
            <Link 
              href="/account" 
              className="hidden md:block relative"
              aria-label="Account"
            >
              <Icon name="user" className="text-xl" />
            </Link>
            <button 
              className="relative"
              onClick={onCartClick}
              aria-label="Cart"
            >
              <Icon name="shopping-bag" className="text-xl" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-xs rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-4 space-y-3 border-t border-[#E0E0E0]">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`block py-2 text-sm uppercase tracking-wide ${
                  location === link.path ? "font-medium" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link 
              href="/search" 
              className="block py-2 text-sm uppercase tracking-wide"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Search
            </Link>
            <Link 
              href="/account" 
              className="block py-2 text-sm uppercase tracking-wide"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
