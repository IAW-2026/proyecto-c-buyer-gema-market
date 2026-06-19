import { z } from "zod";
import { RequiredAddressSchema } from "./address";
import { PhoneSchema } from "./phone";

export const CompleteProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  phoneNumber: PhoneSchema,
  address: RequiredAddressSchema,
});

export type CompleteProfileInput = z.infer<typeof CompleteProfileSchema>;
