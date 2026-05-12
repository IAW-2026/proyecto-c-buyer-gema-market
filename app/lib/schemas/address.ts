import { z } from "zod";

// Dirección opcional — campos con max length, vacíos permitidos (usado en perfil/cuenta)
export const AddressSchema = z.object({
  street: z.string().max(200, "Dirección demasiado larga").default(""),
  number: z.string().max(20, "Número demasiado largo").default(""),
  zip: z.string().max(20, "Código postal demasiado largo").default(""),
});

// Dirección requerida — todos los campos obligatorios (usado en checkout)
export const RequiredAddressSchema = z.object({
  street: z.string().min(1, "La calle es requerida").max(200, "Dirección demasiado larga"),
  number: z.string().min(1, "El número es requerido").max(20, "Número demasiado largo"),
  zip: z.string().min(1, "El código postal es requerido").max(20, "Código postal demasiado largo"),
});

export type AddressInput = z.infer<typeof AddressSchema>;
export type RequiredAddressInput = z.infer<typeof RequiredAddressSchema>;
