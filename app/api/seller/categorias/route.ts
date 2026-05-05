import { NextResponse } from "next/server";
import { MOCK_CATEGORIES } from "@/app/api/seller/mock-data";

/**
 * GET /api/seller/categorias
 * Devuelve el listado de categorías disponibles.
 */
export async function GET() {
  return NextResponse.json(MOCK_CATEGORIES);
}
