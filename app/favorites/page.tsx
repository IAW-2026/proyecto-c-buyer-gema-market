import { Suspense } from "react";
import { TopBar } from "@/app/components/ui";
import FavoritesGrid from "../components/features/favorites/FavoritesGrid";
import FavoritesSkeleton from "../components/features/favorites/FavoritesSkeleton";

export const dynamic = "force-dynamic";

export default function FavoritesPage() {
  return (
    <div className="pb-6">
      {/* TopBar renderiza inmediatamente */}
      <TopBar title="Favoritos" back />

      {/* El contenido carga con Suspense */}
      <div className="p-4">
        <Suspense fallback={<FavoritesSkeleton />}>
          <FavoritesGrid />
        </Suspense>
      </div>
    </div>
  );
}
