import { Usuario } from "@prisma/client";
import { getCurrentUserId } from "@/app/lib/auth/mock";
import { getUsuarioById } from "@/app/lib/db/user";

/**
 * Obtiene el usuario actual directamente del esquema de la base de datos.
 */
export async function getAccountData(): Promise<Usuario | null> {
  const userId = await getCurrentUserId();

  try {
    return await getUsuarioById(userId);
  } catch (error) {
    console.error("Error fetching account data:", error);
    return null;
  }
}
