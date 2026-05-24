import { Suspense } from "react";
import { ShopFetcher } from "@/app/components/features/shop/ShopFetcher";
import { ShopSkeleton } from "@/app/components/features/shop/ShopSkeleton";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default function ShopPage({ params, searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-cream pb-10 lgx:px-7 lgx:pt-8 lgx:pb-14">
      <div className="p-4 min-[600px]:max-w-205 min-[600px]:mx-auto min-[600px]:p-6 lgx:max-w-295 lgx:mx-auto lgx:p-0">
        <Suspense fallback={<ShopSkeleton />}>
          <ShopFetcher params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
