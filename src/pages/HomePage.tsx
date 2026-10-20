import { useEffect, useState } from 'react';
import { Link } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*').eq('is_featured', true).limit(8),
      supabase.from('products').select('*').eq('is_deal', true).limit(8),
      supabase.from('categories').select('*').order('name'),
    ]).then(([featRes, dealsRes, catRes]) => {
      setFeatured(featRes.data || []);
      setDeals(dealsRes.data || []);
      setCategories(catRes.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Shopping"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-xl">
            <span className="inline-block bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
              MEGA SALE EVENT
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Everything you love, delivered fast
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Shop millions of products across electronics, fashion, home and more. Free shipping on orders over $35.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/deals"
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Shop Today's Deals
              </Link>
              <Link
                to="/category/electronics"
                className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-6 py-3 rounded-lg transition-colors border border-white/20"
              >
                Browse Electronics
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders over $35' },
            { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
            { icon: ShieldCheck, title: 'Secure Payment', desc: 'Protected checkout' },
            { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
          ].map((badge) => (
            <div key={badge.title} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <badge.icon size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{badge.title}</p>
                <p className="text-xs text-gray-500">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-gray-300 transition-all"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={cat.image_url || ''}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Today's Deals */}
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Today's Deals</h2>
          <Link to="/deals" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            See all deals →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="w-full aspect-square bg-gray-200 rounded mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {deals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Featured */}
      <div className="max-w-6xl mx-auto px-4 mt-10 mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="w-full aspect-square bg-gray-200 rounded mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
