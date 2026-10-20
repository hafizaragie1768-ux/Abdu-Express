import { Link, useRouter } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, totalItems, clear } = useCart();
  const { navigate } = useRouter();

  const shipping = subtotal > 35 || subtotal === 0 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet. Let's fix that!</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Shopping Cart <span className="text-gray-400 text-lg font-normal">({totalItems} items)</span>
          </h1>
          <button onClick={clear} className="text-sm text-gray-500 hover:text-red-600 transition-colors">
            Clear cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4">
                <Link to={`/product/${item.productId}`} className="w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden bg-gray-50 shrink-0">
                  <img src={item.image_url || ''} alt={item.title} className="w-full h-full object-contain" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.productId}`} className="text-sm sm:text-base font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </Link>
                  <p className="text-lg font-bold text-gray-900 mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-sm text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
            <Link to="/" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium pt-2">
              ← Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-32">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Tax</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between items-baseline mb-4">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
              </div>
              {subtotal > 0 && subtotal < 35 && (
                <p className="text-xs text-amber-600 mb-3 bg-amber-50 p-2 rounded">
                  Add {formatPrice(35 - subtotal)} more to get FREE shipping!
                </p>
              )}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
