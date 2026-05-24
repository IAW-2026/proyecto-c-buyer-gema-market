import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_PRODUCTS,
  MOCK_SELLERS,
  MOCK_CATEGORIES,
} from "@/app/mocks/seller/data";
import { validateApiKey } from "@/app/lib/utils/hmac";

/**
 * GET /api/seller/shops/:seller_id
 * Devuelve la tienda pública de un vendedor con su listado paginado de productos.
 * Retorna 404 si el vendedor no existe.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ seller_id: string }> },
) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { seller_id } = await params;
  const { searchParams } = req.nextUrl;

  const seller = MOCK_SELLERS[seller_id];
  if (!seller) {
    return NextResponse.json(
      { error: `Tienda '${seller_id}' no encontrada.` },
      { status: 404 },
    );
  }

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const page_size = Math.min(
    100,
    Math.max(1, Number(searchParams.get("page_size") ?? 20)),
  );

  const sellerProducts = MOCK_PRODUCTS.filter(
    (p) => p.seller_id === seller_id,
  );

  // Categorías únicas de los productos del vendedor
  const categoryIds = [...new Set(sellerProducts.map((p) => p.category_id))];
  const categories = categoryIds
    .map((id) => MOCK_CATEGORIES.find((c) => c.category_id === id))
    .filter(Boolean);

  // Paginación
  const total = sellerProducts.length;
  const start = (page - 1) * page_size;
  const pageItems = sellerProducts.slice(start, start + page_size);

  const items = pageItems.map(
    ({ product_id, seller_id: sid, title, price, currency, category_id, condition, thumbnail_url, href }) => ({
      product_id,
      seller_id: sid,
      title,
      price,
      currency,
      category_id,
      condition,
      thumbnail_url,
      href,
    }),
  );

  return NextResponse.json({
    seller_id,
    shop_name: seller.shop_name,
    bio: seller.bio,
    logo_url: seller.logo_url,
    city: seller.city,
    total_products: total,
    categories,
    products: { items, page, page_size, total },
  });
}
