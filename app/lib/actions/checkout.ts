"use server";

/**
 * Server Actions del flujo de Checkout.
 *
 * Dos acciones principales:
 *  1. `requestShippingQuoteAction` — cotiza el envío POR CADA PRODUCTO del carrito (Paso 1)
 *  2. `createCheckoutAction`       — crea las órdenes y redirige al pago (Paso 2)
 *
 * Regla de cotización:
 *  - Cada producto distinto en el carrito obtiene su propio quote_id y precio de envío.
 *  - La `quantity` de un item NO multiplica los quotes (enviar 2 sillas = 1 quote de sillas).
 *  - Tener una silla y una mesa = 2 quotes independientes.
 *
 * Flujo completo:
 *  Carrito → cotizar envío por item → crear órdenes en BD → crear orden de pago → checkout_url
 *
 * @see docs/apis.md — POST /api/shipping/cotizaciones
 * @see docs/apis.md — POST /api/payments/ordenes-de-pago
 */

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/app/lib/auth/mapClerkId-UserId";
import { getCarritoByBuyerId, clearCarritoItems } from "@/app/lib/db/carrito";
import { createOrden, updateOrden } from "@/app/lib/db/orden";
import { getProductsBatch } from "@/app/lib/services/seller";
import { requestShippingQuote } from "@/app/lib/services/shipping";
import { createPaymentOrder } from "@/app/lib/services/payment";
import type { CheckoutItem } from "@/app/lib/types/orders";

// ── Constantes ────────────────────────────────────────────────────────────────

function getReturnUrl(): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  return `${base}/checkout/callback`;
}

// ── Tipos de resultado ────────────────────────────────────────────────────────

export type QuoteActionResult =
  | { ok: true; items: CheckoutItem[] }
  | { ok: false; error: string };

export type CheckoutActionResult =
  | { ok: true; checkout_url: string }
  | { ok: false; error: string };

// ── ACCIÓN 1: Cotizar envío por item ─────────────────────────────────────────

/**
 * Resuelve los productos del carrito y cotiza el envío para cada uno individualmente.
 *
 * Regla: un quote por producto distinto, sin importar la quantity.
 *   - 1 silla ×2 unidades → 1 quote (para el producto "silla")
 *   - 1 silla + 1 mesa    → 2 quotes independientes
 *
 * Cada CheckoutItem retornado ya lleva su `quote` embebido para que
 * createCheckoutAction pueda usarlo directamente.
 *
 * @param address - Dirección de entrega del Paso 1
 */
export async function requestShippingQuoteAction(address: {
  street: string;
  number: string;
  zip: string;
}): Promise<QuoteActionResult> {
  try {
    // 1. Validar sesión
    const userId = await getCurrentUserId();
    if (!userId) {
      return { ok: false, error: "Debés iniciar sesión para continuar." };
    }

    // 2. Obtener carrito con items
    const carrito = await getCarritoByBuyerId(userId);
    if (!carrito || carrito.items.length === 0) {
      return { ok: false, error: "Tu carrito está vacío." };
    }

    // 3. Resolver datos de productos desde la Seller App
    const productIds = carrito.items.map((i) => i.productId);
    const { items: products } = await getProductsBatch(productIds);

    if (products.length === 0) {
      return {
        ok: false,
        error: "No se pudieron obtener los datos de los productos.",
      };
    }

    const productMap = new Map(products.map((p) => [p.product_id, p]));

    // 4. Cotizar envío para cada item en paralelo y construir CheckoutItems
    const quoteResults = await Promise.all(
      carrito.items.map(async (item) => {
        const product = productMap.get(item.productId);
        if (!product) return null;

        const weightKg =
          "weight" in product && typeof product.weight === "number"
            ? product.weight
            : 5;
        const heightM =
          "height" in product && typeof product.height === "number"
            ? product.height
            : 0.5;
        const widthM =
          "width" in product && typeof product.width === "number"
            ? product.width
            : 0.5;
        const depthM =
          "depth" in product && typeof product.depth === "number"
            ? product.depth
            : 0.5;

        const quote = await requestShippingQuote({
          destination_address: address,
          product_id: product.product_id,
          weight_kg: weightKg,
          height_m: heightM,
          width_m: widthM,
          depth_m: depthM,
        });

        return {
          itemId: item.id,
          productId: item.productId,
          sellerId: product.seller_id,
          productTitle: product.title,
          quantity: item.quantity,
          unitPrice: product.price,
          quote,
        };
      }),
    );

    const checkoutItems: CheckoutItem[] = quoteResults.filter(
      (r): r is NonNullable<typeof r> => r !== null,
    );

    if (checkoutItems.length === 0) {
      return { ok: false, error: "No hay productos válidos en el carrito." };
    }

    return { ok: true, items: checkoutItems };
  } catch (error) {
    console.error("[requestShippingQuoteAction] Error:", error);
    return {
      ok: false,
      error: "No se pudo calcular el envío. Intentá de nuevo.",
    };
  }
}

// ── ACCIÓN 2: Crear checkout ──────────────────────────────────────────────────

/**
 * Orquesta el flujo completo de creación de órdenes y redirige al pago.
 *
 * Cada item ya trae su `quote` embebido (viene de requestShippingQuoteAction).
 * Por eso no se necesita ningún parámetro adicional de envío.
 *
 * Pasos internos:
 *  1. Validar sesión del comprador
 *  2. Crear una Orden en la BD por cada item (con su propio shippingPrice y quoteId)
 *  3. Crear una PaymentOrder en la Payments App agrupando todas las órdenes
 *  4. Actualizar cada Orden con payment_id y status: 'awaiting_payment'
 *  5. Vaciar el carrito
 *  6. Retornar checkout_url para que el componente haga el redirect
 *
 * Rollback: si la Payments App falla, todas las órdenes creadas se marcan 'cancelled'.
 *
 * @param items - CheckoutItems con quote embebido (de requestShippingQuoteAction)
 */
export async function createCheckoutAction(
  items: CheckoutItem[],
): Promise<CheckoutActionResult> {
  const createdOrderIds: string[] = [];

  try {
    // 1. Validar sesión
    const userId = await getCurrentUserId();
    if (!userId) {
      return { ok: false, error: "Debés iniciar sesión para continuar." };
    }

    // 2. Obtener el carrito para poder vaciarlo al final
    const carrito = await getCarritoByBuyerId(userId);
    if (!carrito || carrito.items.length === 0) {
      return { ok: false, error: "Tu carrito está vacío." };
    }

    // 3. Crear una Orden por cada item, usando su propio quote de envío
    const ordersForPayment = [];

    for (const item of items) {
      // totalAmount = precio del producto × cantidad + envío de ese producto
      const totalAmount = item.unitPrice * item.quantity + item.quote.price;

      const orden = await createOrden({
        buyerId: userId,
        sellerId: item.sellerId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        shippingPrice: item.quote.price, // precio de envío específico de este producto
        totalAmount,
        currency: "ARS",
        status: "created",
        quoteId: item.quote.quote_id, // quote_id específico de este producto
      });

      createdOrderIds.push(orden.id);

      ordersForPayment.push({
        order_id: orden.id,
        seller_id: item.sellerId,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        quote: {
          quote_id: item.quote.quote_id,
          shipping_price: item.quote.price,
        },
      });
    }

    // 4. Crear la PaymentOrder en la Payments App agrupando todas las órdenes
    let paymentResult;
    try {
      paymentResult = await createPaymentOrder({
        buyer_id: userId,
        orders: ordersForPayment,
        currency: "ARS",
        return_url: getReturnUrl(),
      });
    } catch (paymentError) {
      // Rollback: cancelar todas las órdenes creadas en este ciclo
      console.error(
        "[createCheckoutAction] Payments App falló, cancelando órdenes:",
        paymentError,
      );
      for (const orderId of createdOrderIds) {
        await updateOrden(orderId, { status: "cancelled" }).catch((e) =>
          console.error(`No se pudo cancelar la orden ${orderId}:`, e),
        );
      }
      return {
        ok: false,
        error: "No se pudo iniciar el pago. Intentá de nuevo.",
      };
    }

    // 5. Actualizar cada orden con payment_id y status: 'awaiting_payment'
    for (const orderId of createdOrderIds) {
      await updateOrden(orderId, {
        paymentId: paymentResult.payment_id,
        status: "awaiting_payment",
      });
    }

    // 6. Vaciar el carrito
    await clearCarritoItems(carrito.id);

    // 7. Revalidar páginas afectadas
    revalidatePath("/cart");
    revalidatePath("/orders");

    return { ok: true, checkout_url: paymentResult.checkout_url };
  } catch (error) {
    console.error("[createCheckoutAction] Error inesperado:", error);

    // Rollback parcial si hubo órdenes creadas antes del fallo
    if (createdOrderIds.length > 0) {
      for (const orderId of createdOrderIds) {
        await updateOrden(orderId, { status: "cancelled" }).catch((e) =>
          console.error(`No se pudo cancelar la orden ${orderId}:`, e),
        );
      }
    }

    return {
      ok: false,
      error: "Ocurrió un error inesperado. Intentá de nuevo.",
    };
  }
}
