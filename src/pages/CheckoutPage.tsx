import { useState } from 'react';
import { Link, useRouter } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import { CheckCircle, Lock } from 'lucide-react';

export function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { navigate } = useRouter();
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const shipping = subtotal > 35 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name,
          email: form.email,
          shipping_address: {
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country,
          },
          total,
          status: 'confirmed',
        })
        .select()
        .single();

      if (error) throw error;

      if (order) {
        const orderItems = items.map((item) => ({
          order_id: order.id,
          product_id: item.productId,
          product_title: item.title,
          quantity: item.quantity,
          price: item.price,
        }));
        await supabase.from('order_items').insert(orderItems);
      }

      setOrderId(order.id);
      clear();
    } catch (err) {
      alert('Something went wrong processing your order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md text-center w-full">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-mono text-lg font-bold text-gray-900">#{orderId.slice(0, 8).toUpperCase()}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            A confirmation email has been sent to your inbox. Estimated delivery: 2-3 business days.
          </p>
          <Link
            to="/"
            className="inline-block bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">Your cart is empty</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">← Start shopping</Link>
        </div>
      </div>
    );
  }

  const inputClass = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-5">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Forms */}
          <div className="lg:col-span-2 space-y-4">
            {/* Shipping */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">1. Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-700 block mb-1">Full Name</label>
                  <input required value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-700 block mb-1">Email</label>
                  <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-700 block mb-1">Street Address</label>
                  <input required value={form.address} onChange={(e) => update('address', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-sm text-gray-700 block mb-1">City</label>
                  <input required value={form.city} onChange={(e) => update('city', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-sm text-gray-700 block mb-1">State</label>
                  <input required value={form.state} onChange={(e) => update('state', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-sm text-gray-700 block mb-1">ZIP Code</label>
                  <input required value={form.zip} onChange={(e) => update('zip', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-sm text-gray-700 block mb-1">Country</label>
                  <select value={form.country} onChange={(e) => update('country', e.target.value)} className={inputClass}>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-gray-900">2. Payment Method</h2>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Lock size={12} /> Secure
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-700 block mb-1">Card Number</label>
                  <input required placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={(e) => update('cardNumber', e.target.value)} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-700 block mb-1">Name on Card</label>
                  <input required value={form.cardName} onChange={(e) => update('cardName', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-sm text-gray-700 block mb-1">Expiry (MM/YY)</label>
                  <input required placeholder="12/27" value={form.expiry} onChange={(e) => update('expiry', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-sm text-gray-700 block mb-1">CVV</label>
                  <input required placeholder="123" value={form.cvv} onChange={(e) => update('cvv', e.target.value)} className={inputClass} />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                This is a demo store. No real payment will be processed.
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-32">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b">Your Order</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-2 text-sm">
                    <div className="w-12 h-12 rounded bg-gray-50 overflow-hidden shrink-0">
                      <img src={item.image_url || ''} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 line-clamp-1 text-xs">{item.title}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-sm shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <hr className="my-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between items-baseline mb-4">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
              </div>
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-gray-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-3"
              >
                ← Back to cart
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
