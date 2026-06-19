import { z } from "zod";
import { RequiredAddressSchema } from "./address";
import { PhoneSchema } from "./phone";

export const AccountSchema = z.object({
  fullName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  email: z.string().email("El email no es válido"),
  phoneNumber: PhoneSchema,
  address: RequiredAddressSchema,
});

export type AccountInput = z.infer<typeof AccountSchema>;
