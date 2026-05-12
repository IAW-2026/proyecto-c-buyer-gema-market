import { NextRequest, NextResponse } from "next/server";
import { updateOrden } from "@/app/lib/db/orden";
import type { OrdenStatus } from "@prisma/client";

/**
 * POST /api/buyer/ordenes/:order_id/disputa-resuelta
 * Consumido por: Payments App.
 * Notifica la resolución definitiva de una disputa sobre la orden.
 *
 * Mapeo de resolución → estado de orden:
 *   refunded → refunded
 *   otros    → disputed (la disputa fue cerrada sin reembolso)
 *
 * @see docs/apis.md — POST /api/buyer/ordenes/:order_id/disputa-resuelta
 */

const RESOLUTION_TO_ORDER_STATUS: Record<string, OrdenStatus> = {
  refunded: "refunded",
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ order_id: string }> },
) {
  try {
    const { order_id } = await params;
    const body = await req.json();

    const { dispute_id, resolution } = body as {
      dispute_id: string;
      resolution: string;
      resolved_at: string;
    };

    if (!dispute_id || !resolution) {
      return NextResponse.json(
        { error: "dispute_id y resolution son requeridos" },
        { status: 400 },
      );
    }

    const ordenStatus = RESOLUTION_TO_ORDER_STATUS[resolution] ?? "disputed";
    await updateOrden(order_id, { status: ordenStatus });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Error al procesar resolución de disputa" },
      { status: 500 },
    );
  }
}
