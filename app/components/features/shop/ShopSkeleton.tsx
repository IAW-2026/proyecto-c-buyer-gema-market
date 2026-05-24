import { Skeleton } from "@/app/components/ui/Skeleton";
import { ShopCategoryStaticTitle, ShopCategoryPillsSkeleton } from "./ShopCategoryHeader";

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-r3 border border-line bg-paper">
      <div className="aspect-square animate-pulse bg-bone" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-4/5 animate-pulse rounded bg-bone" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-bone" />
        <div className="h-5 w-20 animate-pulse rounded bg-bone" />
      </div>
    </div>
  );
}

function ShopHeaderSkeleton() {
  return (
    <div className="rounded-r3 border border-line bg-paper overflow-hidden mb-4.5">
      <div className="h-37.5 animate-pulse bg-bone min-[600px]:h-47.5 lgx:h-55" />
      <div className="px-4.5 pb-5 lgx:px-6 lgx:pb-6">
        <div className="flex gap-4 items-start -mt-10.5 mb-4 relative z-10">
          <div className="p-1 rounded-full bg-paper shadow-sh-1 shrink-0">
            <div className="w-19 h-19 rounded-full animate-pulse bg-bone" />
          </div>
          <div className="min-w-0 pt-11.5 flex flex-col gap-2 w-full">
            <Skeleton h={28} w="55%" r={6} />
            <Skeleton h={14} w="40%" r={4} />
          </div>
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Skeleton h={14} r={4} />
          <Skeleton h={14} w="75%" r={4} />
        </div>
        <div className="grid grid-cols-2 lgx:grid-cols-3 gap-2.5">
          <div className="bg-bone rounded-r2 p-2 lgx:p-3 flex flex-col gap-2">
            <Skeleton h={11} w="50%" r={3} />
            <Skeleton h={20} w="60%" r={4} />
          </div>
          <div className="bg-bone rounded-r2 p-2 lgx:p-3 flex flex-col gap-2">
            <Skeleton h={11} w="50%" r={3} />
            <Skeleton h={20} w="60%" r={4} />
          </div>
          <div className="hidden lgx:flex bg-bone rounded-r2 p-2 lgx:p-3 flex-col gap-2">
            <Skeleton h={11} w="50%" r={3} />
            <Skeleton h={20} w="60%" r={4} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ShopBodySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 min-[600px]:grid-cols-3 min-[600px]:gap-3.5 lgx:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] lgx:gap-4.5">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function ShopSkeleton() {
  return (
    <>
      <ShopHeaderSkeleton />
      <div className="flex items-end justify-between mb-3">
        <ShopCategoryStaticTitle />
        <ShopCategoryPillsSkeleton />
      </div>
      <ShopBodySkeleton />
    </>
  );
}
