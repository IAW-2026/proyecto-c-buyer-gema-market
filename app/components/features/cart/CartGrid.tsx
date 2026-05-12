import { getCartWithProducts } from "@/app/lib/helpers/cart";
import CartGridClient from "./CartGridClient";

export default async function CartGrid() {
  const initialItems = await getCartWithProducts();
  return <CartGridClient initialItems={initialItems} />;
}
