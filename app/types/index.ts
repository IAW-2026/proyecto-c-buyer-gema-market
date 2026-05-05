export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  seller: string;
  category: string;
  condition: string;
  rating: number;
  imageUrl?: string;
}

export interface ProductsApiResponse {
  data: Product[];
  total: number;
}

export interface CategoriesApiResponse {
  data: Category[];
}

// Params que vienen de la URL (searchParams de Next.js)
export interface HomeSearchParams {
  q?: string;
  cat?: string;
  sort?: string;
  priceMax?: string;
  conditions?: string; // "nuevo,usado" separado por comas
}
