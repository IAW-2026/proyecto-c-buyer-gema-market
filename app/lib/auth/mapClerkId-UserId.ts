import { getUsuarioByClerkId } from "../db/user";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Retorna el ID interno (BD) del usuario autenticado actualmente.
 */

export const getCurrentUserId = async (): Promise<string | null> => {
  const clerkUser = await currentUser();
  if (!clerkUser?.id) return null;

  const usuario = await getUsuarioByClerkId(clerkUser.id);
  return usuario?.id ?? null;
};
