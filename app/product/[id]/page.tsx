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
  const p = await getProductById(resolvedParams.id);

  if (!p) {
    notFound();
  }

  // 2. Simulamos obtener el userId de la sesión
  // const userId = await getUserId();
  const userId = await getCurrentUserId();
  //const favoriteProductIds = await getFavoritosIds(userId);
  const favoriteProductIds = await getFavoritosIds(userId);
  const initialFavorite = favoriteProductIds.includes(p.product_id);

  return <ProductDetailClient p={p} initialFavorite={initialFavorite} />;
}
