import { prisma } from "@/app/lib/prisma";
import { Favorito, Prisma } from "@prisma/client";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type CreateFavoritoInput = {
  buyerId: string;
  productId: string;
};

type FavoritoConBuyer = Prisma.FavoritoGetPayload<{
  include: { buyer: true };
}>;

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────
/**
 * Agrega un producto a los favoritos de un comprador
 * data: crea nuevo Favorito con buyerId y productId
 * include: { buyer: true } → retorna el favorito con datos del comprador
 * Retorna: Favorito creado con info del comprador
 */ export async function createFavorito(
  data: CreateFavoritoInput,
): Promise<FavoritoConBuyer> {
  return prisma.favorito.create({
    data: {
      buyerId: data.buyerId,
      productId: data.productId,
    },
    include: { buyer: true },
  });
}

// ─────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────

/**
 * Busca un favorito específico por comprador y producto
 * where: { buyerId_productId } → busca por clave compuesta única (buyerId + productId)
 * include: { buyer: true } → retorna el favorito con datos del comprador
 * Retorna: Favorito encontrado o null si no existe
 */
export async function getFavorito(
  buyerId: string,
  productId: string,
): Promise<Favorito | null> {
  return prisma.favorito.findUnique({
    where: {
      buyerId_productId: {
        buyerId,
        productId,
      },
    },
    include: { buyer: true },
  });
}
/**
 * Obtiene todos los favoritos de un comprador
 * where: { buyerId } → filtra favoritos del comprador
 * include: { buyer: true } → cada favorito incluye datos del comprador
 * orderBy: { createdAt: "desc" } → ordena del más reciente al más antiguo
 * Retorna: Array de Favoritos del comprador
 */ export async function getFavoritosByBuyerId(
  buyerId: string,
): Promise<FavoritoConBuyer[]> {
  return prisma.favorito.findMany({
    where: { buyerId },
    include: { buyer: true },
    orderBy: { createdAt: "desc" },
  });
}
/**
 * Obtiene todos los favoritos del sistema
 * findMany sin where → retorna todos los Favoritos
 * include: { buyer: true } → cada favorito trae datos del comprador
 * Retorna: Array de todos los Favoritos con sus compradores
 */ export async function getAllFavoritos(): Promise<FavoritoConBuyer[]> {
  return prisma.favorito.findMany({
    include: { buyer: true },
  });
}
/**
 * Verifica si un producto está marcado como favorito por un comprador
 * findUnique: busca por clave compuesta (buyerId_productId)
 * where: { buyerId_productId } → localizador único
 * Sin include: no necesita relaciones, solo confirmar existencia
 * Retorna: true si es favorito, false si no existe
 */ export async function isFavorited(
  buyerId: string,
  productId: string,
): Promise<boolean> {
  const favorito = await prisma.favorito.findUnique({
    where: {
      buyerId_productId: {
        buyerId,
        productId,
      },
    },
  });
  return favorito !== null;
}

// Sirve para poder marcar el corazon en la pantalla si esta
// agregado como favorito o no

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────
/**
 * Elimina un favorito específico
 * where: { buyerId_productId } → localiza por clave compuesta (comprador + producto)
 * include: { buyer: true } → retorna el favorito eliminado con datos del comprador
 * Retorna: Favorito que fue eliminado
 */ export async function deleteFavorito(
  buyerId: string,
  productId: string,
): Promise<FavoritoConBuyer> {
  return prisma.favorito.delete({
    where: {
      buyerId_productId: {
        buyerId,
        productId,
      },
    },
    include: { buyer: true },
  });
}
/**
 * Elimina todos los favoritos de un producto específico
 * deleteMany: borra múltiples registros
 * where: { productId } → filtra favoritos que contengan ese producto
 * Retorna: número de favoritos que fueron eliminados
 */ export async function deleteFavoritosByProductId(
  productId: string,
): Promise<number> {
  const result = await prisma.favorito.deleteMany({
    where: { productId },
  });
  return result.count;
}

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────
/**
 * Alterna el estado de un favorito: agrega si no existe, elimina si existe
 * 1. isFavorited: verifica si el producto ya es favorito
 * 2. Si existe → deleteFavorito: lo elimina y retorna false
 * 3. Si no existe → createFavorito: lo crea y retorna true
 * Retorna: true si ahora es favorito, false si ya no lo es
 */ export async function toggleFavorito(
  buyerId: string,
  productId: string,
): Promise<boolean> {
  const exists = await isFavorited(buyerId, productId);

  if (exists) {
    await deleteFavorito(buyerId, productId);
    return false; // Now it's not favorited
  } else {
    await createFavorito({ buyerId, productId });
    return true; // Now it's favorited
  }
}
