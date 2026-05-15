import { z } from "zod";

/**
 * Body de POST /api/buyer/ordenes/:order_id/estado-envio (consumido por Shipping App).
 *
 * `pending_pickup` queda fuera a propósito: el handler no lo mapea a ningún cambio
 * de estado de la orden, y aceptarlo solo sería ruido (200 OK silencioso).
 */
export const ShippingStatusUpdateSchema = z.object({
  shipping_id: z.string().min(1),
  status: z.enum(["in_transit", "delivered", "failed"]),
});

export type ShippingStatusUpdateInput = z.infer<
  typeof ShippingStatusUpdateSchema
>;
