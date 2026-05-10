/**
 * Mock de autenticación — solo para desarrollo.
 *
 * Reemplazar el cuerpo de `getCurrentUserId` por la
 * llamada real a Clerk cuando la auth esté lista:
 *
 *   import { auth } from "@clerk/nextjs/server";
 *   const { userId } = await auth();
 *   if (!userId) throw new Error("Not authenticated");
 *   return userId;
 */

import { getUsuarioByClerkId } from "../db/user";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Retorna el ID del usuario actual.
 * Por ahora retorna el ID del usuario de desarrollo hardcodeado.
 */
export async function getCurrentUserId(): Promise<string> {
  // Intentar obtener el usuario actual desde Clerk (si está disponible)
  try {
    const clerkUser = await currentUser();
    const clerkId = clerkUser?.id ?? null;

    if (clerkId) {
      const usuario = await getUsuarioByClerkId(clerkId);
      if (usuario) return usuario.id;
    }
  } catch (err) {
    console.log(
      "No se pudo obtener el usuario de Clerk (probablemente no autenticado):",
      err,
    );
  }

  // Fallback de desarrollo: ID hardcodeado (mantener para pruebas locales)
  const id_clerk = "mock_clerk_user_dev2";
  const usuario = await getUsuarioByClerkId(id_clerk);
  if (usuario) return usuario.id;

  return "";
}
