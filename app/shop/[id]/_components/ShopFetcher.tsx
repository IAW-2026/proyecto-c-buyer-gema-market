import { notFound } from "next/navigation";
import { getShopById } from "@/app/lib/api/seller";
import { getFavoritosIds } from "@/app/lib/db/favorite";
import { getCurrentUserId } from "@/app/lib/auth/mapClerkIdToUserId";
import { ShopHeader } from "./ShopHeader";
import {
  ShopCategoryStaticTitle,
  ShopCategoryPills,
} from "./ShopCategoryHeader";
import { ShopProductsGrid } from "./ShopProductsGrid";
import { SHOP_PAGE_SIZE } from "@/app/lib/constants/pagination";

interface ShopFetcherProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function ShopFetcher({ params, searchParams }: ShopFetcherProps) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [shop, favoriteIds] = await Promise.all([
    getShopById(id, page, SHOP_PAGE_SIZE),
    getCurrentUserId().then((uid) => (uid ? getFavoritosIds(uid) : [])),
  ]);

  if (!shop) notFound();

  const { items, total, page_size } = shop.products;
  const totalPages = Math.ceil(total / page_size);

  return (
    <>
      <ShopHeader shop={shop} />
      <div className="flex items-end justify-between mb-3">
        <ShopCategoryStaticTitle />
        <ShopCategoryPills categories={shop.categories} />
      </div>
      <ShopProductsGrid
        items={items}
        favoriteIds={favoriteIds}
        totalPages={totalPages}
      />
    </>
  );
}
