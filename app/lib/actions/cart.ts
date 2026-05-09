"use server";

import { revalidatePath } from "next/cache";
import {
  updateItemCarritoQuantity,
  deleteItemCarrito,
  upsertItemCarrito,
} from "@/app/lib/db/item_carrito";
import { getCurrentUserId } from "@/app/lib/auth/mock";
import { getCarritoByBuyerId, createCarrito } from "@/app/lib/db/carrito";

/**
 * Acción de servidor para agregar un producto al carrito.
 * Si el carrito no existe, lo crea.
 */
export async function addToCartAction(productId: string, quantity: number) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "Usuario no autenticado" };
    }

    // 1. Obtener o crear el carrito del usuario
    const existingCarrito = await getCarritoByBuyerId(userId);
    let carritoId: string;

    if (!existingCarrito) {
      const nuevoCarrito = await createCarrito({ buyerId: userId });
      carritoId = nuevoCarrito.id;
    } else {
      carritoId = existingCarrito.id;
    }

    // 2. Agregar o actualizar el item en el carrito (upsert)
    // Nota: upsertItemCarrito ya suma la cantidad actual + la nueva
    await upsertItemCarrito({
      carritoId,
      productId,
      quantity,
    });

    // 3. Revalidar para que el contador del carrito y el stock del producto se actualicen
    revalidatePath("/cart");
    revalidatePath(`/product/${productId}`);

    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: "No se pudo agregar al carrito" };
  }
}

/**
 * Acción de servidor para actualizar la cantidad de un item en el carrito.
 * Valida que la cantidad sea al menos 1.
 */
export async function updateCartItemQuantityAction(
  itemId: string,
  newQuantity: number,
) {
  if (newQuantity < 1) {
    throw new Error(
      "La cantidad debe ser al menos 1. Para eliminar use la acción de remover.",
    );
  }

  try {
    await updateItemCarritoQuantity(itemId, newQuantity);
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return { success: false, error: "No se pudo actualizar la cantidad" };
  }
}

/**
 * Acción de servidor para eliminar un item del carrito.
 */
export async function removeCartItemAction(itemId: string) {
  try {
    await deleteItemCarrito(itemId);
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error removing cart item:", error);
    return {
      success: false,
      error: "No se pudo eliminar el producto del carrito",
    };
  }
}
