import { notFound } from "next/navigation";
import { getProductById } from "@/app/lib/services/seller";
import ProductDetailClient from "../../components/products/ProductDetailClient";
import { getFavoritosIds } from "@/app/lib/db/favorito";
import { getCurrentUserId } from "@/app/lib/auth/mock";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;

  // 1. Obtenemos el producto y el userId en paralelo
  const [p, userId] = await Promise.all([
    getProductById(resolvedParams.id),
    getCurrentUserId(),
  ]);

  if (!p) {
    notFound();
  }

  // 2. Obtenemos los favoritos del usuario
  const favoriteProductIds = await getFavoritosIds(userId);
  const initialFavorite = favoriteProductIds.includes(p.product_id);

  return <ProductDetailClient p={p} initialFavorite={initialFavorite} />;
}
