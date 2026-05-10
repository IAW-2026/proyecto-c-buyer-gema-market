"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/app/lib/auth/mapClerkId-UserId";
import { updateUsuario } from "@/app/lib/db/user";

// ---------------------------------------------------------------------------
// Schema de validación
// ---------------------------------------------------------------------------

const AddressSchema = z.object({
  street: z.string().max(200, "Dirección demasiado larga").default(""),
  city: z.string().max(100, "Ciudad demasiado larga").default(""),
  postalCode: z.string().max(20, "Código postal demasiado largo").default(""),
});

const AccountSchema = z.object({
  fullName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  email: z.string().email("El email no es válido"),
  phoneNumber: z
    .string()
    .regex(
      /^[+\d\s\-().]*$/,
      "El teléfono solo puede contener números, espacios, +, -, ( y )",
    )
    .max(30, "El teléfono es demasiado largo")
    .default(""),
  address: AddressSchema,
});

// ---------------------------------------------------------------------------
// Server Action
// ---------------------------------------------------------------------------

/**
 * Server Action para actualizar los datos del usuario.
 * Valida el payload con Zod antes de persistir en la base de datos.
 */
export async function updateAccountAction(data: unknown) {
  // 1. Validar con Zod
  const parsed = AccountSchema.safeParse(data);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      ok: false,
      error: firstIssue?.message ?? "Datos inválidos.",
    };
  }

  // 2. Obtener usuario autenticado
  const userId = await getCurrentUserId();
  if (!userId) {
    return { ok: false, error: "No autenticado." };
  }

  // 3. Persistir
  try {
    await updateUsuario(userId, parsed.data);
    revalidatePath("/account");
    return { ok: true };
  } catch (error) {
    console.error("Error updating account:", error);
    return {
      ok: false,
      error: "No se pudieron guardar los cambios en el servidor.",
    };
  }
}
