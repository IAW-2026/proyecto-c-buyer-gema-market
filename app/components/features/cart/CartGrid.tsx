import { getCartWithProducts } from "@/app/lib/helpers/cart";
import { requestShippingQuote } from "@/app/lib/services/shipping";
import { getAccountData } from "@/app/lib/helpers/account";
import CartGridClient from "./CartGridClient";

/**
 * Componente de servidor que obtiene los datos del carrito
 * y los pasa al componente de cliente para la interactividad.
 * Se definio asi dado que CartGridClient usa useState, es decir, es un componente de cliente
 * y CartGrid, al obtener los datos de CartSummary y CartItem, debe ser componente de servidor
 * Un archivo de cliente no puede usar await, de ahi la division.
 */
export default async function CartGrid() {
  const [initialItems, accountData] = await Promise.all([
    getCartWithProducts(),
    getAccountData(),
  ]);
  const addressJson = accountData?.address as {
    street?: string;
    number?: string;
    zip?: string;
  } | null;

  const destStreet = addressJson?.street || "Estimado";
  const destNumber = addressJson?.number || "0";
  const destZip = addressJson?.zip || "8000";

  let estimatedShipping = 0;

  if (initialItems.length > 0) {
    for (const item of initialItems) {
      // Usar peso de fallback si no está disponible (la API de lista no siempre lo trae)
      const weightKg =
        "weight" in item && typeof item.weight === "number" ? item.weight : 5;
      const heightM =
        "height" in item && typeof item.height === "number" ? item.height : 0.5;
      const widthM =
        "width" in item && typeof item.width === "number" ? item.width : 0.5;
      const depthM =
        "depth" in item && typeof item.depth === "number" ? item.depth : 0.5;

      try {
        const quote = await requestShippingQuote({
          destination_address: {
            street: destStreet,
            number: destNumber,
            zip: destZip,
          },
          product_id: item.product_id,
          weight_kg: weightKg,
          height_m: heightM,
          width_m: widthM,
          depth_m: depthM,
        });
        estimatedShipping += quote.price;
      } catch (e) {
        console.error("Error fetching mock quote for cart grid", e);
      }
    }
  }

  return (
    <CartGridClient
      initialItems={initialItems}
      estimatedShipping={estimatedShipping}
    />
  );
}
