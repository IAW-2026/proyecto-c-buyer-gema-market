"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/app/lib/auth/mapClerkIdToUserId";
import { updateUsuario } from "@/app/lib/db/user";
import { CompleteProfileSchema } from "@/app/lib/schemas/completeProfile";

export async function completeProfileAction(
  _prevState: unknown,
  formData: FormData,
) {
  const data = {
    fullName: formData.get("fullName"),
    phoneNumber: formData.get("phoneNumber"),
    address: {
      street: formData.get("street"),
      number: formData.get("number"),
      zip: formData.get("zip"),
    },
  };

  const parsed = CompleteProfileSchema.safeParse(data);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { ok: false, error: firstIssue?.message ?? "Datos inválidos." };
  }

  const userId = await getCurrentUserId();
  if (!userId) return { ok: false, error: "No autenticado." };

  try {
    await updateUsuario(userId, {
      fullName: parsed.data.fullName,
      phoneNumber: parsed.data.phoneNumber,
      address: parsed.data.address,
    });

    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("Error completing profile:", error);
    return {
      ok: false,
      error: "No se pudieron guardar los datos. Intentá de nuevo.",
    };
  }
}
