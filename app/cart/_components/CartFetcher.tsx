import { getCartWithProducts } from "@/app/lib/helpers/cart";
import CartGridClient from "./CartGridClient";

export async function CartFetcher() {
  const items = await getCartWithProducts();
  return <CartGridClient initialItems={items} />;
}
