import { useState, useEffect, useRef } from 'react';
import { Link, useRouter } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { Category } from '@/lib/types';

interface HeaderProps {
  categories: Category[];
}

export function Header({ categories }: HeaderProps) {
  const { totalItems } = useCart();
  const { navigate, params } = useRouter();
  const [searchQuery, setSearchQuery] = useState(params.q || '');
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchQuery(params.q || '');
  }, [params.q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900 text-white">
      {/* Top bar */}
      <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2">
        <button
          className="lg:hidden p-1 hover:bg-gray-800 rounded"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Link to="/" className="flex items-center gap-1 shrink-0">
          <span className="text-xl sm:text-2xl font-bold tracking-tight">
            Abdu<span className="text-amber-400"> Express</span>
          </span>
        </Link>
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl flex">
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, brands and more..."
            className="flex-1 px-4 py-2 text-gray-900 text-sm rounded-l-md outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-500 text-gray-900 px-4 rounded-r-md transition-colors"
          >
            <Search size={20} />
          </button>
        </form>
        <Link
          to="/cart"
          className="relative flex items-center gap-1.5 hover:text-amber-400 transition-colors shrink-0 px-2"
        >
          <div className="relative">
            <ShoppingCart size={26} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-900 text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {totalItems}
              </span>
            )}
          </div>
          <span className="hidden sm:inline text-sm font-medium">Cart</span>
        </Link>
      </div>

      {/* Category nav - desktop */}
      <nav className="hidden lg:flex items-center gap-1 px-4 py-1.5 bg-gray-800 text-sm overflow-x-auto">
        <Link to="/" className="px-3 py-1 hover:text-amber-400 transition-colors whitespace-nowrap font-medium">
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="px-3 py-1 hover:text-amber-400 transition-colors whitespace-nowrap"
          >
            {cat.name}
          </Link>
        ))}
        <Link to="/deals" className="px-3 py-1 text-red-400 hover:text-red-300 transition-colors whitespace-nowrap font-medium">
          Today's Deals
        </Link>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="lg:hidden bg-gray-800 px-3 py-2 flex flex-col gap-1 text-sm border-t border-gray-700">
          <Link to="/" className="px-3 py-2 hover:bg-gray-700 rounded transition-colors font-medium" onClick={() => setMenuOpen(false)}>
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="px-3 py-2 hover:bg-gray-700 rounded transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
          <Link to="/deals" className="px-3 py-2 text-red-400 hover:bg-gray-700 rounded transition-colors font-medium" onClick={() => setMenuOpen(false)}>
            Today's Deals
          </Link>
        </nav>
      )}
    </header>
  );
}
