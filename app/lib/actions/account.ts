"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/app/lib/auth/mock";
import { updateUsuario, Address } from "@/app/lib/db/user";

/**
 * Server Action para actualizar los datos del usuario.
 */
export async function updateAccountAction(data: {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: Address;
}) {
  const userId = await getCurrentUserId();

  try {
    await updateUsuario(userId, data);

    // Revalidamos la ruta para que los cambios se reflejen en el servidor
    revalidatePath("/account");

    return { success: true };
  } catch (error) {
    console.error("Error updating account:", error);
    return {
      success: false,
      error: "No se pudieron guardar los cambios en el servidor.",
    };
  }
}
