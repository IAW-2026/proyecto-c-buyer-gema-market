import { getCurrentUserId } from "@/app/lib/auth/mock";
import { getCarritoByBuyerId } from "@/app/lib/db/carrito";
import { getProductsBatch } from "@/app/lib/services/seller";
import type { ProductListItem } from "@/app/lib/types/product";

/**
 * Interface que extiende ProductListItem para incluir la cantidad en el carrito.
 */
export interface CartItemWithProduct extends ProductListItem {
  quantity: number;
}

/**
 * Obtiene los productos que están en el carrito del usuario actual,
 * enriquecidos con los datos de la Seller App mediante getProductsBatch.
 */
export async function getCartWithProducts(): Promise<CartItemWithProduct[]> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

  try {
    // 1. Obtener el carrito del usuario con sus items
    const carrito = await getCarritoByBuyerId(userId);

    if (!carrito || !carrito.items || carrito.items.length === 0) {
      return [];
    }

    // 2. Extraer los IDs de los productos
    const productIds = carrito.items.map((item) => item.productId);

    // 3. Obtener los datos de los productos en batch desde el servicio de Seller
    const response = await getProductsBatch(productIds);
    const products = response?.items || [];

    // 4. Mapear los productos para incluir la cantidad almacenada en el carrito
    const itemMap = new Map(
      carrito.items.map((item) => [item.productId, item.quantity]),
    );

    return products.map((product) => ({
      ...product,
      quantity: itemMap.get(product.product_id) || 0,
    }));
  } catch (error) {
    console.error("Error fetching cart with products:", error);
    return [];
  }
}
