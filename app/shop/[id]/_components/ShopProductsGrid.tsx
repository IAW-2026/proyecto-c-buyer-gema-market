import type { ProductListItem } from "@/app/lib/types/product";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { Pagination } from "@/app/components/ui/Pagination";
import ProductCard from "@/app/components/products/ProductCard";

interface ShopProductsGridProps {
  items: ProductListItem[];
  favoriteIds: string[];
  totalPages: number;
}

export function ShopProductsGrid({
  items,
  favoriteIds,
  totalPages,
}: ShopProductsGridProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon="box"
        title="Sin productos"
        body="Esta tienda no tiene publicaciones activas."
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 min-[600px]:grid-cols-3 min-[600px]:gap-3.5 lgx:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] lgx:gap-[18px]">
        {items.map((product, index) => (
          <ProductCard
            key={product.product_id}
            product={product}
            priority={index < 4}
            initialFavorite={favoriteIds.includes(product.product_id)}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <section className="flex justify-center py-12">
          <Pagination totalPages={totalPages} />
        </section>
      )}
    </>
  );
}
