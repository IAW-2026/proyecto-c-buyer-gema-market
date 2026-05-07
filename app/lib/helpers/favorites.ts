import { getCurrentUserId } from "@/app/lib/auth/mock";
import { getFavoritosIds } from "@/app/lib/db/favorito";
import { getProductsBatch } from "@/app/lib/services/seller";
import type { ProductListItem } from "@/app/lib/types/product";

//

export async function getFavoritesWithProducts(): Promise<ProductListItem[]> {
  const userId = await getCurrentUserId();

  try {
    const favoriteProductIds = await getFavoritosIds(userId);

    if (favoriteProductIds.length === 0) {
      return [];
    }

    const response = await getProductsBatch(favoriteProductIds);
    return response?.items || [];
  } catch (error) {
    console.error("Error fetching favorites with products:", error);
    return [];
  }
}
