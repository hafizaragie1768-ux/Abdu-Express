import { useEffect, useState } from 'react';
import { RouterProvider, useRouter } from '@/lib/router';
import { CartProvider } from '@/lib/cart';
import { supabase } from '@/lib/supabase';
import { Category } from '@/lib/types';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { ProductListPage } from '@/pages/ProductListPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';

function AppContent() {
  const { path, params } = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => {
      setCategories(data || []);
    });
  }, []);

  const renderPage = () => {
    // /product/:id
    const productMatch = path.match(/^\/product\/([\w-]+)$/);
    if (productMatch) {
      return <ProductDetailPage productId={productMatch[1]} categories={categories} />;
    }

    // /category/:slug
    const categoryMatch = path.match(/^\/category\/([\w-]+)$/);
    if (categoryMatch) {
      return <ProductListPage categorySlug={categoryMatch[1]} categories={categories} />;
    }

    // /deals
    if (path === '/deals') {
      return <ProductListPage dealsOnly categories={categories} />;
    }

    // /search?q=...
    if (path === '/search' && params.q) {
      return <ProductListPage searchQuery={params.q} categories={categories} />;
    }

    // /cart
    if (path === '/cart') {
      return <CartPage />;
    }

    // /checkout
    if (path === '/checkout') {
      return <CheckoutPage />;
    }

    // / (home)
    if (path === '/' || path === '') {
      return <HomePage />;
    }

    // fallback
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header categories={categories} />
      <main className="flex-1">{renderPage()}</main>
      <Footer categories={categories} />
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </RouterProvider>
  );
}

export default App;
