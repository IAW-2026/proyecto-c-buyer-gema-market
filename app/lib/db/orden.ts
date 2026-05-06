import { prisma } from "@/app/lib/prisma";
import { Orden, OrdenStatus, Prisma } from "@prisma/client";

// ─────────────────────────────────────────────
// Types

// ─────────────────────────────────────────────

type CreateOrdenInput = {
  buyerId: string;
  sellerId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  shippingPrice: number;
  totalAmount: number;
  currency?: string;
  status?: OrdenStatus;
  quoteId?: string;
  paymentId?: string;
  shippingId?: string;
};

type UpdateOrdenInput = Partial<{
  quantity: number;
  status: OrdenStatus;
  paymentId: string;
  shippingId: string;
  quoteId: string;
}>;

type OrdenConBuyer = Prisma.OrdenGetPayload<{
  include: { buyer: true };
}>;

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

export async function createOrden(
  data: CreateOrdenInput /**
   * Crea una nueva orden (compra de un producto)
   * data: todos los detalles de la orden (comprador, vendedor, producto, precios, etc.)
   * Valores por defecto: currency='ARS', status='created', IDs de relaciones=null
   * include: { buyer: true } → retorna orden con datos del comprador
   * Retorna: Orden creada con todas sus propiedades y datos del buyer
   */,
): Promise<OrdenConBuyer> {
  return prisma.orden.create({
    data: {
      buyerId: data.buyerId,
      sellerId: data.sellerId,
      productId: data.productId,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      shippingPrice: data.shippingPrice,
      totalAmount: data.totalAmount,
      currency: data.currency ?? "ARS",
      status: data.status ?? "created",
      quoteId: data.quoteId ?? null,
      paymentId: data.paymentId ?? null,
      shippingId: data.shippingId ?? null,
    },
    include: { buyer: true },
  });
}

// ─────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────
/**
 * Busca una orden por su ID
 * where: { id } → localiza la orden única
 * include: { buyer: true } → retorna orden con datos del comprador
 * Retorna: Orden encontrada con datos del buyer o null si no existe
 */ export async function getOrdenById(
  id: string,
): Promise<OrdenConBuyer | null> {
  return prisma.orden.findUnique({
    where: { id },
    include: { buyer: true },
  });
}
/**
 * Obtiene TODAS las órdenes del sistema
 * findMany sin where → retorna todas las Órdenes
 * include: { buyer: true } → cada orden trae datos de su comprador
 * Retorna: Array de todas las Órdenes con compradores
 */ export async function getAllOrdenes(): Promise<OrdenConBuyer[]> {
  return prisma.orden.findMany({
    include: { buyer: true },
  });
}

export async function getOrdenesByBuyerId(
  buyerId: string,
): Promise<OrdenConBuyer[]> {
  return prisma.orden.findMany({
    where: { buyerId },
    include: { buyer: true },
    orderBy: { createdAt: "desc" },
  });
}
/**
 * Obtiene todas las órdenes con un estado específico
 * where: { status } → filtra órdenes por estado (created, pending, completed, etc.)
 * include: { buyer: true } → cada orden trae datos del comprador
 * Retorna: Array de Órdenes con ese estado
 */ export async function getOrdenesByStatus(
  status: OrdenStatus,
): Promise<OrdenConBuyer[]> {
  return prisma.orden.findMany({
    where: { status },
    include: { buyer: true },
  });
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────
/**
 * Actualiza una orden existente
 * where: { id } → localiza la orden exacta
 * data: { quantity?, status?, paymentId?, shippingId?, quoteId? } → cambios parciales
 * include: { buyer: true } → retorna orden actualizada con datos del comprador
 * Retorna: Orden modificada con sus cambios aplicados
 */ export async function updateOrden(
  id: string,
  data: UpdateOrdenInput,
): Promise<OrdenConBuyer> {
  return prisma.orden.update({
    where: { id },
    data,
    include: { buyer: true },
  });
}

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────
/**
 * Elimina una orden
 * where: { id } → localiza la orden exacta
 * include: { buyer: true } → retorna orden eliminada con datos del comprador
 * Retorna: Orden que fue eliminada
 */ export async function deleteOrden(id: string): Promise<OrdenConBuyer> {
  return prisma.orden.delete({
    where: { id },
    include: { buyer: true },
  });
}
