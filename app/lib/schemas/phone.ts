import { z } from "zod";

export const PhoneSchema = z
  .string()
  .min(1, "El teléfono es requerido")
  .regex(
    /^[+\d\s\-().]*$/,
    "El teléfono solo puede contener números, espacios, +, -, ( y )",
  )
  .max(30, "El teléfono es demasiado largo")
  .refine(
    (val) => val.replace(/\D/g, "").length >= 7,
    "El teléfono debe tener al menos 7 dígitos",
  );
