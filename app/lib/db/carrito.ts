import { prisma } from "@/app/lib/prisma";
import { Carrito, Prisma } from "@prisma/client";
import { generateUlid } from "../utils/ulidGenerator";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type CreateCarritoInput = {
  buyerId: string;
};

type CarritoConRelaciones = Prisma.CarritoGetPayload<{
  include: { items: true };
}>;

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────
/**
 * Crea un nuevo carrito para un comprador
 * Retorna: el carrito con sus items incluidos (array vacío al inicio)
 * Relaciones: items (ItemCarrito[])
 */ export async function createCarrito(
  data: CreateCarritoInput,
): Promise<Carrito> {
  return prisma.carrito.create({
    data: {
      id: generateUlid("car"),
      buyerId: data.buyerId,
    },
    include: { items: true },
  });
}

// ─────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────

/**
 * Busca un carrito específico por su ID
 * where: { id } → localiza el carrito exacto
 * include: items + buyer → retorna carrito con sus items y datos del comprador
 * Retorna: Carrito con relaciones o null si no existe
 */
export async function getCarritoById(
  id: string,
): Promise<CarritoConRelaciones | null> {
  return prisma.carrito.findUnique({
    where: { id },
    include: { items: true },
  });
}
/**
 * Busca el carrito de un comprador específico
 * where: { buyerId } → filtra por ID del comprador
 * findFirst → retorna el primer (y único) carrito que coincida
 * include: items + buyer → retorna carrito con sus items y datos del comprador
 * Retorna: Carrito con relaciones o null si el comprador no tiene carrito
 */ export async function getCarritoByBuyerId(
  buyerId: string,
): Promise<CarritoConRelaciones | null> {
  return prisma.carrito.findFirst({
    where: { buyerId },
    include: { items: true },
  });
}
/**
 * Obtiene todos los carritos del sistema
 * findMany sin where → retorna todos los carritos
 * include: items + buyer → cada carrito trae sus items y datos del comprador
 * Retorna: Array de Carritos con sus relaciones
 */ export async function getAllCarritos(): Promise<CarritoConRelaciones[]> {
  return prisma.carrito.findMany({
    include: { items: true },
  });
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

/**
 * Actualiza un carrito (actualmente no cambia datos, data: {})
 * where: { id } → localiza el carrito a actualizar
 * data: {} → sin cambios en este caso
 * include: items + buyer → retorna carrito actualizado con sus relaciones
 * Retorna: Carrito modificado con sus items y datos del comprador
 */
export async function updateCarrito(id: string): Promise<Carrito> {
  return prisma.carrito.update({
    where: { id },
    data: {},
    include: { items: true, buyer: true },
  });
}

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

/**
 * Elimina un carrito y todos sus items
 * 1. deleteMany items: borra todos los ItemCarrito asociados al carrito
 *    where: { carritoId: id } → filtra items del carrito a eliminar
 * 2. delete carrito: borra el carrito después de limpiar sus items
 *    where: { id } → localiza el carrito exacto
 * Retorna: Carrito eliminado (sin relaciones)
 */
export async function deleteCarrito(id: string): Promise<Carrito> {
  // First delete all items in the carrito
  await prisma.itemCarrito.deleteMany({
    where: { carritoId: id },
  });
  // delete carrito
  return prisma.carrito.delete({
    where: { id },
  });
}

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────

/**
 * Vacía un carrito: elimina todos sus items sin borrar el carrito
 * deleteMany: borra múltiples items
 * where: { carritoId } → filtra solo los items del carrito especificado
 * Retorna: void (no retorna datos, solo ejecuta la acción)
 */
export async function clearCarritoItems(carritoId: string): Promise<void> {
  await prisma.itemCarrito.deleteMany({
    where: { carritoId },
  });
}
