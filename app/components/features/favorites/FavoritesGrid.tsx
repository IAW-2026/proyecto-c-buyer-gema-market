import ProductCard from "@/app/components/products/ProductCard";
import { EmptyState } from "@/app/components/ui";
import { getFavoritesWithProducts } from "@/app/lib/helpers/favorites";

export default async function FavoritesGrid() {
  const favorites = await getFavoritesWithProducts();

  if (!favorites || favorites.length === 0) {
    return (
      <EmptyState
        icon="heart"
        title="Aún no tenés favoritos"
        body="Tocá el corazoncito en cualquier producto."
      />
    );
  }

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(190px,1fr))] max-[420px]:grid-cols-1 lgx:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] lgx:gap-4.5">
      {favorites.map((product) => (
        <ProductCard
          key={product.product_id}
          product={product}
          initialFavorite={true}
        />
      ))}
    </div>
  );
}
