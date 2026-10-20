import { Link } from '@/lib/router';
import { Product } from '@/lib/types';
import { formatPrice, discountPercent } from '@/lib/format';
import { StarRating } from './StarRating';
import { useCart } from '@/lib/cart';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const discount = discountPercent(product.price, product.compare_at_price);

  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200 flex flex-col">
      <Link to={`/product/${product.id}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.image_url || ''}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <Link to={`/product/${product.id}`} className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors mb-1 min-h-[2.5rem]">
          {product.title}
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={product.rating} size={14} />
          <span className="text-xs text-gray-500">({product.review_count})</span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.compare_at_price)}</span>
          )}
        </div>
        <button
          onClick={() =>
            addItem({
              productId: product.id,
              title: product.title,
              price: product.price,
              image_url: product.image_url,
              quantity: 1,
            })
          }
          className="mt-auto w-full bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-medium py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
