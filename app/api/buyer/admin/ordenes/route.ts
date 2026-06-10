import { NextRequest, NextResponse } from "next/server";
import { OrdenStatus } from "@prisma/client";
import { isAdminRequest } from "@/app/lib/auth/adminGate";
import {
  getOrdenesAdminApi,
  countOrdenesAdminApi,
} from "@/app/lib/db/order";

const VALID_SORT_FIELDS = ["created_at", "total_amount", "status"] as const;
const VALID_STATUSES = Object.values(OrdenStatus);

/**
 * GET /api/buyer/admin/ordenes
 * Consumido por: Control Plane, Analytics Dashboard.
 * Requiere JWT de Clerk con role = "admin_buyer".
 *
 * @see docs/apis.md
 */
export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;

  const buyerId = searchParams.get("buyer_id") ?? undefined;
  const sellerId = searchParams.get("seller_id") ?? undefined;
  const statusParam = searchParams.get("status") ?? undefined;
  const dateFrom = searchParams.get("date_from") ?? undefined;
  const dateTo = searchParams.get("date_to") ?? undefined;

  const sortByParam = searchParams.get("sort_by") ?? "created_at";
  const sortBy = VALID_SORT_FIELDS.includes(
    sortByParam as (typeof VALID_SORT_FIELDS)[number],
  )
    ? sortByParam
    : "created_at";

  const orderParam = searchParams.get("order") ?? "desc";
  const order: "asc" | "desc" = orderParam === "asc" ? "asc" : "desc";

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("page_size") ?? "20", 10) || 20),
  );

  const status =
    statusParam && VALID_STATUSES.includes(statusParam as OrdenStatus)
      ? (statusParam as OrdenStatus)
      : undefined;

  const filter = {
    buyerId,
    sellerId,
    status,
    dateFrom: dateFrom ? new Date(dateFrom) : undefined,
    dateTo: dateTo ? new Date(dateTo) : undefined,
  };

  try {
    const [items, total] = await Promise.all([
      getOrdenesAdminApi({ ...filter, sortBy, order, skip: (page - 1) * pageSize, take: pageSize }),
      countOrdenesAdminApi(filter),
    ]);

    return NextResponse.json({
      items: items.map((o) => ({
        order_id: o.id,
        buyer_id: o.buyerId,
        seller_id: o.sellerId,
        product_id: o.productId,
        total_amount: Number(o.totalAmount),
        status: o.status,
        created_at: o.createdAt,
      })),
      page,
      page_size: pageSize,
      total,
      sort_by: sortBy,
      order,
    });
  } catch (error) {
    console.error("[GET /api/buyer/admin/ordenes] Error:", error);
    return NextResponse.json(
      { error: "Error al obtener órdenes" },
      { status: 500 },
    );
  }
}
