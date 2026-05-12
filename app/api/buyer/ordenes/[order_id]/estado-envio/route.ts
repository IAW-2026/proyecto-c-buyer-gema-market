import { NextRequest, NextResponse } from "next/server";
import { updateOrden } from "@/app/lib/db/orden";
import type { OrdenStatus } from "@prisma/client";

/**
 * POST /api/buyer/ordenes/:order_id/estado-envio
 * Consumido por: Shipping App.
 * Notifica cambios en el estado logístico del envío asociado a la orden.
 *
 * Mapeo de estados de Shipping → Orden:
 *   pending_pickup → paid     (esperando retiro, sin cambio de estado de orden)
 *   in_transit     → shipping
 *   delivered      → delivered
 *   failed         → cancelled
 *
 * @see docs/apis.md — POST /api/buyer/ordenes/:order_id/estado-envio
 */

const SHIPPING_TO_ORDER_STATUS: Record<string, OrdenStatus> = {
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
    const body = await req.json();

    const { shipping_id, status } = body as {
      shipping_id: string;
      status: string;
      tracking_code: string;
      updated_at: string;
    };

    if (!shipping_id || !status) {
      return NextResponse.json(
        { error: "shipping_id y status son requeridos" },
        { status: 400 },
      );
    }

    const ordenStatus = SHIPPING_TO_ORDER_STATUS[status];

    if (ordenStatus) {
      await updateOrden(order_id, { status: ordenStatus, shippingId: shipping_id });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Error al procesar actualización de envío" },
      { status: 500 },
    );
  }
}
