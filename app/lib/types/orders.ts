/**
 * Tipos de orden según la documentación de la Buyer App y el esquema de Prisma.
 * @see docs/apis.md — GET /api/buyer/admin/ordenes
 * @see prisma/schema.prisma — enum `OrdenStatus`
 */

export type OrderStatus =
  | "created"
  | "awaiting_payment"
  | "paid"
  | "shipping"
  | "delivered"
  | "shipping_failed"
  | "cancelled"
  | "refunded"
  | "disputed";

/** Representación de una orden (compra) para la UI del comprador. */
export interface Order {
  id: string; // Usamos 'id' para consistencia con el frontend, mapeado de 'order_id'
  date: string; // ISO string o formato legible (mapeado de 'created_at')
  status: OrderStatus;
  items: number; // Cantidad de artículos (simplificado para el mock)
  total: number; // Monto total (mapeado de 'total_amount')
  buyer: string; // Nombre del comprador (UI)
  address: string; // Dirección de entrega
  trackId: string; // Código de seguimiento
}
