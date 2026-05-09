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

/**
 * Retorna el ID del usuario actual.
 * Por ahora retorna el ID del usuario de desarrollo hardcodeado.
 */
export async function getCurrentUserId(): Promise<string> {
  // TODO: reemplazar con Clerk cuando auth esté lista
  const id_clerk = "mock_clerk_user_dev2";

  // Hace consulta a la base de datos para obtener el id del usuario con el id de clerk
  const usuario = await getUsuarioByClerkId(id_clerk);
  if (usuario) {
    return usuario.id;
  }

  return "";
}
