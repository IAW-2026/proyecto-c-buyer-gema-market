import { Suspense } from "react";
import { TopBar } from "@/app/components/ui";
import CartGrid from "@/app/components/features/cart/CartGrid";
import CartSkeleton from "@/app/components/features/cart/CartSkeleton";

// force-dynamic fuerza que la pagina se renderice del lado del servidor y no del cliente
// Esto hace que CartGrid pueda usar await
export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <div className="pb-[140px]">
      <TopBar back title="Tu carrito" />

      <Suspense fallback={<CartSkeleton />}>
        <CartGrid />
      </Suspense>
    </div>
  );
}
