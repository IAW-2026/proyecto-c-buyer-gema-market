import ProductCard from "@/app/components/products/ProductCard";
import { getProductsByIds } from "@/app/lib/services/seller";
import { EmptyState } from "@/app/components/ui";

const FAVORITE_PRODUCT_IDS = [
  "prd_01HABCDEF001",
  "prd_01HABCDEF003",
  "prd_01HABCDEF005",
  "prd_01HABCDEF007",
  "prd_01HABCDEF008",
];

export default async function FavoritesGrid() {
  // TODO: Reemplazar con query a BD
  // const favoritos = await prisma.favorito.findMany({
  //   where: { buyer_id: userId },
  //   select: { product_id: true },
  // });
  // const productIds = favoritos.map(f => f.product_id);

  const favs = await getProductsByIds(FAVORITE_PRODUCT_IDS);

  if (favs.length === 0) {
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
      {favs.map((p) => (
        <ProductCard key={p.product_id} product={p} />
      ))}
    </div>
  );
}
