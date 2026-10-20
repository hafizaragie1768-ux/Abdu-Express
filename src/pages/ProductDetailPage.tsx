import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, Review } from '@/lib/types';
import { Link, useRouter } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { formatPrice, discountPercent } from '@/lib/format';
import { StarRating } from '@/components/StarRating';
import { ProductCard } from '@/components/ProductCard';
import { Minus, Plus, ShoppingCart, Truck, RotateCcw, ShieldCheck, ChevronRight } from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
  categories: { id: string; name: string; slug: string }[];
}

export function ProductDetailPage({ productId, categories }: ProductDetailPageProps) {
  const { navigate } = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setProduct(null);
    setReviews([]);
    setRelated([]);
    setSelectedImage(0);
    setQuantity(1);

    supabase.from('products').select('*').eq('id', productId).maybeSingle().then(({ data }) => {
      setProduct(data);
      setLoading(false);
      if (data) {
        const imgs = data.images && data.images.length > 0 ? data.images : [data.image_url];
        setSelectedImage(0);
        supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false })
          .then(({ data: revData }) => setReviews(revData || []));

        if (data.category_id) {
          supabase
            .from('products')
            .select('*')
            .eq('category_id', data.category_id)
            .neq('id', productId)
            .limit(4)
            .then(({ data: relData }) => setRelated(relData || []));
        }
      }
    });
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-700">Product not found</p>
        <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">← Back to home</Link>
      </div>
    );
  }

  const images: string[] = (product.images && product.images.length > 0 ? product.images : [product.image_url]).filter((u): u is string => !!u);
  const discount = discountPercent(product.price, product.compare_at_price);
  const category = categories.find((c) => c.id === product.category_id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image_url: product.image_url,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image_url: product.image_url,
      quantity,
    });
    navigate('/cart');
  };

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={14} />
          {category && (
            <>
              <Link to={`/category/${category.slug}`} className="hover:text-blue-600">{category.name}</Link>
              <ChevronRight size={14} />
            </>
          )}
          <span className="text-gray-700 line-clamp-1">{product.title}</span>
        </nav>

        {/* Product main */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Images */}
            <div className="lg:col-span-5">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
                <img
                  src={images[selectedImage] || ''}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                        selectedImage === i ? 'border-blue-600' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain bg-gray-50" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-4">
              {product.brand && (
                <p className="text-sm text-blue-600 font-medium mb-1">{product.brand}</p>
              )}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center gap-2 mb-3">
                <StarRating rating={product.rating} size={18} />
                <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                  {product.review_count} ratings
                </span>
              </div>
              <hr className="my-3" />
              <div className="mb-4">
                {discount > 0 && (
                  <span className="inline-block bg-red-600 text-white text-sm font-bold px-2 py-0.5 rounded mr-2">
                    -{discount}%
                  </span>
                )}
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-lg text-gray-400 line-through ml-2">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
                {discount > 0 && (
                  <p className="text-sm text-red-600 font-medium mt-1">
                    You save {formatPrice(product.compare_at_price! - product.price)}
                  </p>
                )}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{product.description}</p>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-gray-500">Availability: </span>
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  )}
                </p>
              </div>
            </div>

            {/* Buy box */}
            <div className="lg:col-span-3">
              <div className="border border-gray-200 rounded-lg p-4 sticky top-32">
                <p className="text-2xl font-bold text-gray-900 mb-2">{formatPrice(product.price)}</p>
                <p className="text-sm text-green-600 font-medium mb-3">
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
                <div className="text-sm text-gray-600 mb-3">
                  FREE delivery on orders over $35. Get it in 2-3 business days.
                </div>

                {product.stock > 0 && (
                  <>
                    <div className="mb-3">
                      <label className="text-sm text-gray-700 block mb-1">Quantity</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className={`w-full font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors mb-2 ${
                        added ? 'bg-green-500 text-white' : 'bg-amber-400 hover:bg-amber-500 text-gray-900'
                      }`}
                    >
                      <ShoppingCart size={18} />
                      {added ? 'Added!' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mb-3"
                    >
                      Buy Now
                    </button>
                  </>
                )}

                <hr className="my-3" />
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-gray-400" />
                    Secure transaction
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-gray-400" />
                    Ships from Abdu Express
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw size={16} className="text-gray-400" />
                    30-day returns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rating summary */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                <span className="text-3xl font-bold text-gray-900">{product.rating.toFixed(1)}</span>
                <span className="text-gray-400">/5</span>
              </div>
              <StarRating rating={product.rating} size={18} className="justify-center md:justify-start mb-1" />
              <p className="text-sm text-gray-500">{product.review_count} global ratings</p>
              <div className="mt-3 space-y-1">
                {ratingCounts.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600 w-12">{star} star</span>
                    <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                      <div
                        className="h-full bg-amber-400"
                        style={{ width: `${product.review_count > 0 ? (count / product.review_count) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-gray-500 text-xs w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review list */}
            <div className="md:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                        {review.author_name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm text-gray-900">{review.author_name}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <StarRating rating={review.rating} size={14} />
                      <span className="text-sm font-medium text-gray-800">{review.title}</span>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customers also bought</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
