import { NextRequest, NextResponse } from "next/server";
import { updateOrden } from "@/app/lib/db/orden";

/**
 * POST /api/buyer/pagos/:payment_id/rechazado
 * Consumido por: Payments App.
 * Notifica rechazo/cancelación del pago para liberar las órdenes incluidas.
 *
 * @see docs/apis.md — POST /api/buyer/pagos/:payment_id/rechazado
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { orders } = body as {
      payment_id: string;
      orders: {
        order_id: string;
        status: string;
        reason: string;
      }[];
    };

    if (!Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json(
        { error: "orders is required and must be a non-empty array" },
        { status: 400 },
      );
    }

    await Promise.all(
      orders.map((o) => updateOrden(o.order_id, { status: "cancelled" })),
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Error al procesar rechazo de pago" },
      { status: 500 },
    );
  }
}
