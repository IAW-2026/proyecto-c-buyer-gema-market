import { getCartWithProducts } from "@/app/lib/helpers/cart";
import CartGridClient from "./CartGridClient";

/**
 * Componente de servidor que obtiene los datos del carrito
 * y los pasa al componente de cliente para la interactividad.
 * Se definio asi dado que CartGridClient usa useState, es decir, es un componente de cliente
 * y CartGrid, al obtener los datos de CartSummary y CartItem, debe ser componente de servidor
 * Un archivo de cliente no puede usar await, de ahi la division.
 */
export default async function CartGrid() {
  const initialItems = await getCartWithProducts();

  return <CartGridClient initialItems={initialItems} />;
}
