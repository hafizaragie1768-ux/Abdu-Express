import { Link } from '@/lib/router';
import { Category } from '@/lib/types';

interface FooterProps {
  categories: Category[];
}

export function Footer({ categories }: FooterProps) {
  return (
    <footer className="mt-12">
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white text-sm py-3 transition-colors"
      >
        Back to top
      </button>

      <div className="bg-gray-900 text-gray-300 px-4 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">All Products</Link></li>
              <li><Link to="/deals" className="hover:text-amber-400 transition-colors">Today's Deals</Link></li>
              {categories.slice(0, 3).map((cat) => (
                <li key={cat.id}><Link to={`/category/${cat.slug}`} className="hover:text-amber-400 transition-colors">{cat.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Help Center</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Track Order</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Returns</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Shipping Info</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">About</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Our Story</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Careers</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Press</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Sustainability</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Newsletter</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Instagram</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Twitter</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">YouTube</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-700 text-center text-sm">
          <p className="text-gray-400">
            Abdu Express - A demo ecommerce store. Built with React, Supabase & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
