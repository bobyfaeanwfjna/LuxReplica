import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import ProductPage from "@/pages/ProductPage";
import CategoryPage from "@/pages/CategoryPage";
import { CartProvider } from "@/context/CartContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/product/:slug" component={ProductPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
