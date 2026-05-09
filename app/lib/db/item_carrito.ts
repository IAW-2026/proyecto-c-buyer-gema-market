import { prisma } from "@/app/lib/prisma";
import { ItemCarrito } from "@prisma/client";
import { generateUlid } from "../utils/ulidGenerator";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type CreateItemCarritoInput = {
  carritoId: string;
  productId: string;
  quantity: number;
};

// Que sea partial significa que puede ser opcional
// Si quiero actualizar solo uno, no necesito pasar los demás.
// Por ejemplo: si quiero actualizar solo la cantidad, no necesito pasar
// el productId.
type UpdateItemCarritoInput = Partial<{
  quantity: number;
  productId: string;
}>;

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

/**
 * Agrega un producto al carrito (crea un ItemCarrito)
 * data: { carritoId, productId, quantity } → nuevo item con cantidad
 * Sin include: retorna solo el item, sin relaciones
 * Retorna: ItemCarrito creado con id, timestamps, etc.
 */
export async function createItemCarrito(
  data: CreateItemCarritoInput,
): Promise<ItemCarrito> {
  return prisma.itemCarrito.create({
    data: {
      id: generateUlid("itm"),
      carritoId: data.carritoId,
      productId: data.productId,
      quantity: data.quantity,
    },
  });
}

/**
 * Agrega un producto al carrito de forma segura (upsert).
 * Si el producto ya existe en el carrito, incrementa la cantidad.
 * Si no existe, lo crea.
 * Respeta la restricción @@unique([carritoId, productId]).
 * Retorna: ItemCarrito actualizado o creado.
 */
export async function upsertItemCarrito(
  data: CreateItemCarritoInput,
): Promise<ItemCarrito> {
  const existing = await prisma.itemCarrito.findFirst({
    where: {
      carritoId: data.carritoId,
      productId: data.productId,
    },
  });

  if (existing) {
    return prisma.itemCarrito.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + data.quantity },
    });
  }

  // No existe: crear nuevo
  return prisma.itemCarrito.create({
    data: {
      id: generateUlid("itm"),
      carritoId: data.carritoId,
      productId: data.productId,
      quantity: data.quantity,
    },
  });
}

// ─────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────

/**
 * Busca un item del carrito por su ID
 * where: { id } → localiza el item único
 * Sin include: retorna solo el item, sin relaciones
 * Retorna: ItemCarrito encontrado o null si no existe
 */
export async function getItemCarritoById(
  id: string,
): Promise<ItemCarrito | null> {
  return prisma.itemCarrito.findUnique({
    where: { id },
  });
}

/**
 * Obtiene todos los items de un carrito específico
 * where: { carritoId } → filtra items del carrito
 * orderBy: { addedAt: "desc" } → ordena del más reciente al más antiguo
 * Retorna: Array de ItemCarrito del carrito (ordenado)
 */
export async function getItemsByCarritoId(
  carritoId: string,
): Promise<ItemCarrito[]> {
  return prisma.itemCarrito.findMany({
    where: { carritoId },
    orderBy: { addedAt: "desc" },
  });
}

/**
 * Busca un item específico en el carrito por producto
 * where: { carritoId, productId } → filtra por carrito Y producto
 * findFirst: retorna el primer (único) item que coincida
 * Retorna: ItemCarrito encontrado o null si el producto no está en el carrito
 */
export async function getItemByCarritoAndProduct(
  carritoId: string,
  productId: string,
): Promise<ItemCarrito | null> {
  return prisma.itemCarrito.findFirst({
    where: {
      carritoId,
      productId,
    },
  });
}

/**
 * Obtiene TODOS los items de TODOS los carritos
 * findMany sin where → retorna todos los ItemCarrito del sistema
 * Retorna: Array de todos los items
 */
export async function getAllItemsCarrito(): Promise<ItemCarrito[]> {
  return prisma.itemCarrito.findMany();
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

/**
 * Actualiza solo la cantidad de un item del carrito
 * where: { id } → localiza el item exacto
 * data: { quantity } → cambia solo el campo quantity, otros campos sin cambios
 * Retorna: ItemCarrito actualizado con nueva cantidad
 */
export async function updateItemCarritoQuantity(
  id: string,
  quantity: number,
): Promise<ItemCarrito> {
  return prisma.itemCarrito.update({
    where: { id },
    data: { quantity },
  });
}

/**
 * Actualiza uno o varios campos de un item del carrito
 * where: { id } → localiza el item exacto
 * data: { quantity?, productId? } → cambios parciales (solo qué envíes)
 * Retorna: ItemCarrito actualizado con los cambios aplicados
 */
export async function updateItemCarrito(
  id: string,
  data: UpdateItemCarritoInput,
): Promise<ItemCarrito> {
  return prisma.itemCarrito.update({
    where: { id },
    data,
  });
}

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

/**
 * Elimina un item del carrito
 * where: { id } → localiza el item exacto
 * delete: borra el registro
 * Retorna: ItemCarrito que fue eliminado
 */
export async function deleteItemCarrito(id: string): Promise<ItemCarrito> {
  return prisma.itemCarrito.delete({
    where: { id },
  });
}

/**
 * Elimina un producto específico del carrito
 * deleteMany: borra múltiples items (aunque típicamente sea uno)
 * where: { carritoId, productId } → filtra por carrito Y producto
 * Retorna: true si se eliminó algo, false si no existía ese item
 */
export async function deleteItemByCarritoAndProduct(
  carritoId: string,
  productId: string,
): Promise<boolean> {
  const result = await prisma.itemCarrito.deleteMany({
    where: {
      carritoId,
      productId,
    },
  });
  return result.count > 0;
}
