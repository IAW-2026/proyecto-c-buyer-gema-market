"use server";

import { revalidatePath } from "next/cache";
import { toggleFavorito } from "@/app/lib/db/favorito";
import { getCurrentUserId } from "@/app/lib/auth/mapClerkId-UserId";

/**
 * Alterna favorito de un producto
 * Validaciones:
 * - productId no puede estar vacío
 * - userId debe existir (via getCurrentUserId)
 */
export async function toggleFavoriteAction(productId: string) {
  // Validación de entrada
  if (!productId?.trim()) {
    return { success: false, error: "ID de producto inválido" };
  }

  const userId = await getCurrentUserId();

  try {
    await toggleFavorito(userId, productId);

    // Invalida rutas que muestran favoritos
    revalidatePath("/favorites");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { success: false, error: "No se pudo actualizar el favorito" };
  }
}
