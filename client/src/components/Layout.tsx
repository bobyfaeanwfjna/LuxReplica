import { ReactNode, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
