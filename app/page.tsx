import { Suspense } from "react";
import { ProductGridFetcher } from "@/app/_components/ProductGridFetcher";
import ProductGridSkeleton from "@/app/components/products/ProductGridSkeleton";
import { HeaderHomePage } from "@/app/_components/HeaderHomePage";

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function Home({ searchParams }: HomePageProps) {
  return (
    <div className="flex-1 w-full">
      <section id="homepage-header">
        <HeaderHomePage />
      </section>

      <section id="homepage-grid" className="pt-2 pb-8 lgx:pt-3 lgx:pb-7">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGridFetcher searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
}
