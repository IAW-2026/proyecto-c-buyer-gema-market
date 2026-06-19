import { Suspense } from "react";
import { TopBar } from "@/app/components/ui";
import FavoritesGrid from "./_components/FavoritesGrid";
import FavoritesSkeleton from "./_components/FavoritesSkeleton";

export default function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  return (
    <div className="pb-6">
      <TopBar title="Favoritos" back />

      <div className="p-4">
        <Suspense fallback={<FavoritesSkeleton />}>
          <FavoritesGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
