import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { useRouter } from '@/lib/router';
import { SlidersHorizontal } from 'lucide-react';

interface ProductListPageProps {
  categorySlug?: string;
  searchQuery?: string;
  dealsOnly?: boolean;
  categories: Category[];
}

type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest';

export function ProductListPage({ categorySlug, searchQuery, dealsOnly, categories }: ProductListPageProps) {
  const { navigate } = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>('featured');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1500 });
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const categoryName = categorySlug
    ? categories.find((c) => c.slug === categorySlug)?.name
    : null;

  useEffect(() => {
    setLoading(true);
    let query = supabase.from('products').select('*');

    if (dealsOnly) {
      query = query.eq('is_deal', true);
    }
    if (categorySlug) {
      const cat = categories.find((c) => c.slug === categorySlug);
      if (cat) query = query.eq('category_id', cat.id);
    }
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`);
    }

    query.then(({ data }) => {
      setProducts(data || []);
      setLoading(false);
    });
  }, [categorySlug, searchQuery, dealsOnly, categories]);

  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.brand && set.add(p.brand));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let result = products;
    if (selectedBrands.length > 0) {
      result = result.filter((p) => p.brand && selectedBrands.includes(p.brand));
    }
    result = result.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }
    switch (sort) {
      case 'price_asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result = [...result].reverse();
        break;
      default:
        result = [...result].sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    }
    return result;
  }, [products, selectedBrands, priceRange, minRating, sort]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const title = dealsOnly
    ? "Today's Deals"
    : searchQuery
    ? `Results for "${searchQuery}"`
    : categoryName
    ? categoryName
    : 'All Products';

  const filterPanel = (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-sm text-gray-900 mb-2">Brand</h3>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm text-gray-900 mb-2">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => setPriceRange((p) => ({ ...p, min: Number(e.target.value) }))}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Min"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => setPriceRange((p) => ({ ...p, max: Number(e.target.value) }))}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Max"
          />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm text-gray-900 mb-2">Minimum Rating</h3>
        <div className="space-y-1.5">
          {[0, 3, 4, 4.5].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => setMinRating(r)}
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {r === 0 ? 'All ratings' : `${r}+ stars`}
            </label>
          ))}
        </div>
      </div>
      {(selectedBrands.length > 0 || minRating > 0 || priceRange.min > 0 || priceRange.max < 1500) && (
        <button
          onClick={() => {
            setSelectedBrands([]);
            setMinRating(0);
            setPriceRange({ min: 0, max: 1500 });
          }}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-3">
          <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
          <span className="mx-1">/</span>
          <span className="text-gray-700">{title}</span>
        </nav>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden flex items-center gap-1.5 text-sm bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Avg. Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-32">
              <h2 className="font-bold text-gray-900 mb-4 pb-2 border-b">Filters</h2>
              {filterPanel}
            </div>
          </aside>

          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                  <h2 className="font-bold text-gray-900">Filters</h2>
                  <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                {filterPanel}
                <button
                  onClick={() => setShowFilters(false)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md font-medium"
                >
                  Show {filtered.length} results
                </button>
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 p-3 animate-pulse">
                    <div className="w-full aspect-square bg-gray-200 rounded mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg mb-2">No products found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-3">{filtered.length} results</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
