import { NextRequest, NextResponse } from "next/server";
import { updateOrden } from "@/app/lib/db/orden";
import {
  ShippingStatusUpdateSchema,
  type ShippingStatusUpdateInput,
} from "@/app/lib/schemas/shipping";
import type { OrdenStatus } from "@prisma/client";

/**
 * POST /api/buyer/ordenes/:order_id/estado-envio
 * Consumido por: Shipping App.
 * Notifica cambios en el estado logístico del envío asociado a la orden.
 *
 * Mapeo de estados de Shipping → Orden:
 *   in_transit → shipping
 *   delivered  → delivered
 *   failed     → shipping_failed
 *
 * `pending_pickup` no es aceptado: el schema lo rechaza con 400.
 *
 * @see docs/apis.md — POST /api/buyer/ordenes/:order_id/estado-envio
 */

const SHIPPING_TO_ORDER_STATUS: Record<
  ShippingStatusUpdateInput["status"],
  OrdenStatus
> = {
  in_transit: "shipping",
  delivered: "delivered",
  failed: "shipping_failed",
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ order_id: string }> },
) {
  try {
    const { order_id } = await params;
    const parsed = ShippingStatusUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      console.warn(
        "[POST /api/buyer/ordenes/estado-envio] body inválido:",
        parsed.error.issues,
      );
      return NextResponse.json(
        { error: "Body inválido", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const { shipping_id, status } = parsed.data;

    await updateOrden(order_id, {
      status: SHIPPING_TO_ORDER_STATUS[status],
      shippingId: shipping_id,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "[POST /api/buyer/ordenes/estado-envio] Error:",
      error,
    );
    return NextResponse.json(
      { error: "Error al procesar actualización de envío" },
      { status: 500 },
    );
  }
}
