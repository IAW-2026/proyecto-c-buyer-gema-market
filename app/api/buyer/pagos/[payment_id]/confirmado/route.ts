import { NextRequest, NextResponse } from "next/server";
import { updateOrden } from "@/app/lib/db/orden";

/**
 * POST /api/buyer/pagos/:payment_id/confirmado
 * Consumido por: Payments App.
 * Notifica que el pago fue aprobado para las órdenes incluidas.
 *
 * @see docs/apis.md — POST /api/buyer/pagos/:payment_id/confirmado
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { orders } = body as {
      payment_id: string;
      orders: {
        order_id: string;
        mp_payment_id: string;
        status: string;
        amount: number;
        currency: string;
        paid_at: string;
      }[];
    };

    if (!Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json(
        { error: "orders is required and must be a non-empty array" },
        { status: 400 },
      );
    }

    await Promise.all(
      orders.map((o) => updateOrden(o.order_id, { status: "paid" })),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[POST /api/buyer/pagos/confirmado] Error:", error);
    return NextResponse.json(
      { error: "Error al procesar confirmación de pago" },
      { status: 500 },
    );
  }
}
