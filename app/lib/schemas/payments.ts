import { z } from "zod";

/**
 * Body de POST /api/buyer/pagos/:payment_id/confirmado (consumido por Payments App).
 * Solo validamos los campos que el handler usa; el resto del contrato se ignora.
 */
export const PaymentConfirmedSchema = z.object({
  orders: z
    .array(z.object({ order_id: z.string().min(1) }))
    .min(1, "orders no puede estar vacío"),
});

/**
 * Body de POST /api/buyer/pagos/:payment_id/rechazado (consumido por Payments App).
 */
export const PaymentRejectedSchema = z.object({
  orders: z
    .array(z.object({ order_id: z.string().min(1) }))
    .min(1, "orders no puede estar vacío"),
});

export type PaymentConfirmedInput = z.infer<typeof PaymentConfirmedSchema>;
export type PaymentRejectedInput = z.infer<typeof PaymentRejectedSchema>;
