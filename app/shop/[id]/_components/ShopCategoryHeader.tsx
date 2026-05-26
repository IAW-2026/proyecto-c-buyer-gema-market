import type { Category } from "@/app/lib/types/product";
import { Pill } from "@/app/components/ui/Pill";
import { Skeleton } from "@/app/components/ui/Skeleton";

export function ShopCategoryStaticTitle() {
  return (
    <div>
      <div className="text-[11px] font-mono uppercase text-ink-3 mb-1">
        Publicaciones
      </div>
      <h2 className="m-0 text-[22px] font-bold">Productos de la tienda</h2>
    </div>
  );
}

interface ShopCategoryPillsProps {
  categories: Category[];
}

export function ShopCategoryPills({ categories }: ShopCategoryPillsProps) {
  if (categories.length === 0) return null;
  return (
    <div className="flex gap-1.5 flex-wrap max-[480px]:hidden">
      {categories.slice(0, 3).map((cat) => (
        <Pill key={cat.category_id}>{cat.name}</Pill>
      ))}
    </div>
  );
}

export function ShopCategoryPillsSkeleton() {
  return (
    <div className="flex gap-1.5 mb-3 max-[480px]:hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} h={26} w={64} r={13} />
      ))}
    </div>
  );
}
