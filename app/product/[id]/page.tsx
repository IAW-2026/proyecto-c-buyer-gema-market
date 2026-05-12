import { notFound } from "next/navigation";
import { getProductById } from "@/app/lib/api/seller";
import ProductDetailClient from "../../components/products/ProductDetailClient";
import { isFavorited } from "@/app/lib/db/favorito";
import { getCurrentUserId } from "@/app/lib/auth/mapClerkId-UserId";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;

  // Paralelo: producto + check de favorito.
  // isFavorited usa findUnique por clave primaria compuesta (buyerId, productId) — O(1).
  // Es más eficiente que getFavoritosIds que trae todos los IDs para luego hacer includes().
  const [p, initialFavorite] = await Promise.all([
    getProductById(resolvedParams.id),
    getCurrentUserId().then((id) =>
      id ? isFavorited(id, resolvedParams.id) : false,
    ),
  ]);

  if (!p) notFound();

  return <ProductDetailClient p={p} initialFavorite={initialFavorite} />;
}
