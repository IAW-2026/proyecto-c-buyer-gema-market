import { getCurrentUserId } from "@/app/lib/auth/mock";
import { createCarrito, getCarritoByBuyerId } from "@/app/lib/db/carrito";
import { createItemCarrito } from "@/app/lib/db/item_carrito";

/**
 * Script de utilidad para poblar el carrito del usuario de desarrollo.
 * Ejecución: Visitar /api/debug/seed-cart en el navegador.
 */
export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return new Response(
        "No se encontró el usuario de desarrollo. Asegúrate de que exista en la DB.",
        { status: 404 },
      );
    }

    // 1. Asegurarnos de que el usuario tenga un carrito
    let carrito = await getCarritoByBuyerId(userId);
    if (!carrito) {
      carrito = (await createCarrito({ buyerId: userId })) as any;
      console.log("Carrito creado para el usuario:", userId);
    }

    // 2. Agregar un par de productos de prueba si el carrito está vacío
    if (carrito && carrito.items.length === 0) {
      await createItemCarrito({
        carritoId: carrito.id,
        productId: "prd_01HABCDEF001",
        quantity: 1,
      });

      await createItemCarrito({
        carritoId: carrito.id,
        productId: "prd_01HABCDEF012",
        quantity: 2,
      });

      return new Response(
        "Carrito poblado con éxito con 'p1' y 'p4'. ¡Ya puedes revisar /cart!",
        { status: 200 },
      );
    }

    return new Response(
      "El carrito ya tenía items. No se agregaron nuevos para evitar duplicados.",
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response("Error al poblar el carrito: " + error.message, {
        status: 500,
      });
    }
    return new Response("Error al poblar el carrito", {
      status: 500,
    });
  }
}
