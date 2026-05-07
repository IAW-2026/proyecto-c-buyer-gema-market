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

export const DEV_USER_ID = "usr_01JTTESTUSER00000000000001";

/**
 * Retorna el ID del usuario actual.
 * Por ahora retorna el ID del usuario de desarrollo hardcodeado.
 */
export async function getCurrentUserId(): Promise<string> {
  // TODO: reemplazar con Clerk cuando auth esté lista
  return DEV_USER_ID;
}
