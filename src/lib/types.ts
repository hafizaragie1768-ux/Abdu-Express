export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  brand: string | null;
  category_id: string | null;
  image_url: string | null;
  images: string[];
  rating: number;
  review_count: number;
  stock: number;
  is_featured: boolean;
  is_deal: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image_url: string | null;
  quantity: number;
}
