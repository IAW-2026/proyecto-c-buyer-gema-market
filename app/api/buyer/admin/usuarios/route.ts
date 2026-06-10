import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/auth/adminGate";
import { getAllUsuarios, countUsuarios } from "@/app/lib/db/user";

/**
 * GET /api/buyer/admin/usuarios
 * Consumido por: Control Plane, Analytics Dashboard.
 */
export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;

  const q = searchParams.get("q") ?? undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("page_size") ?? "20", 10) || 20),
  );

  try {
    const [items, total] = await Promise.all([
      getAllUsuarios({ search: q, skip: (page - 1) * pageSize, take: pageSize }),
      countUsuarios(q),
    ]);

    return NextResponse.json({
      items: items.map((u) => ({
        user_id: u.id,
        clerk_user_id: u.clerkUserId,
        email: u.email,
        full_name: u.fullName,
        phone_number: u.phoneNumber ?? null,
        role: u.role,
        created_at: u.createdAt,
      })),
      page,
      page_size: pageSize,
      total,
    });
  } catch (error) {
    console.error("[GET /api/buyer/admin/usuarios] Error:", error);
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}
