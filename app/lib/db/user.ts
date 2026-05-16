import { prisma } from "@/app/lib/prisma";
import { Usuario, Role } from "@prisma/client";
import { generateUlid } from "@/app/lib/utils/ulidGenerator";
import type { Address } from "@/app/lib/types/user";

export type { Address };

type CreateUsuarioInput = {
  clerkUserId: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: Address;
  role?: Role;
};

// Que sea partial significa que puede ser opcional
// Si quiero actualizar solo uno, no necesito pasar los demás.
// Por ejemplo: si quiero actualizar solo el email, no necesito pasar
// fullName, address y role.
type UpdateUsuarioInput = Partial<{
  email: string;
  fullName: string;
  phoneNumber: string;
  address: Address;
  role: Role;
}>;

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

/**
 * Crea un nuevo usuario (comprador)
 * data: info básica del usuario (clerkUserId, email, nombre, etc.)
 * Valores por defecto: role='buyer', address=undefined si no se proporciona
 * Sin include: retorna solo el usuario, sin relaciones
 * Retorna: Usuario creado con sus propiedades
 */
export async function createUsuario(
  data: CreateUsuarioInput,
): Promise<Usuario> {
  return prisma.usuario.create({
    data: {
      id: generateUlid("usr"),
      clerkUserId: data.clerkUserId,
      email: data.email,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber ?? null,
      address: data.address ?? undefined,
      role: data.role ?? "buyer",
    },
  });
}

// ─────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────

/**
 * Busca un usuario por su ID interno
 * where: { id } → localiza el usuario único
 * Sin include: retorna solo el usuario, sin relaciones
 * Retorna: Usuario encontrado o null si no existe
 */
export async function getUsuarioById(id: string): Promise<Usuario | null> {
  return prisma.usuario.findUnique({
    where: { id },
  });
}

/**
 * Busca un usuario por su ID de Clerk (autenticación externa)
 * where: { clerkUserId } → localiza por ID del proveedor de auth
 * Sin include: retorna solo el usuario, sin relaciones
 * Retorna: Usuario encontrado o null si no existe en BD
 */
export async function getUsuarioByClerkId(
  clerkUserId: string,
): Promise<Usuario | null> {
  return prisma.usuario.findUnique({
    where: { clerkUserId },
  });
}

/**
 * Obtiene usuarios con paginación opcional, ordenados por fecha de creación (descendente).
 * Sin opciones: retorna todos los usuarios.
 * Con { skip, take }: retorna la página correspondiente.
 */
export async function getAllUsuarios(opts?: {
  skip?: number;
  take?: number;
}): Promise<Usuario[]> {
  return prisma.usuario.findMany({
    skip: opts?.skip,
    take: opts?.take,
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Cuenta total de usuarios — útil para calcular páginas en listados paginados.
 */
export async function countUsuarios(): Promise<number> {
  return prisma.usuario.count();
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

/**
 * Actualiza un usuario existente
 * where: { id } → localiza el usuario exacto
 * data: { email?, fullName?, address?, role? } → cambios parciales
 * Sin include: retorna solo el usuario actualizado
 * Retorna: Usuario modificado con cambios aplicados
 */
export async function updateUsuario(
  id: string,
  data: UpdateUsuarioInput,
): Promise<Usuario> {
  return prisma.usuario.update({
    where: { id },
    data,
  });
}

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

/**
 * Elimina un usuario del sistema
 * where: { id } → localiza el usuario exacto
 * delete: borra el registro
 * Sin include: retorna solo el usuario eliminado
 * Retorna: Usuario que fue eliminado
 */
export async function deleteUsuario(id: string): Promise<Usuario> {
  return prisma.usuario.delete({
    where: { id },
  });
}

// ─────────────────────────────────────────────
// HELPER - Cast JSON address field
// ─────────────────────────────────────────────
// Nota: el doble cast as unknown as Address es necesario porque
// Prisma tipea el campo Json? como Prisma.JsonValue, y no hay
// forma de hacer la conversión directamente sin él.

/**
 * Convierte el campo JSON 'address' de Usuario a tipo Address
 * Necesario porque Prisma tipea campos JSON como Prisma.JsonValue
 * Validación: si address es null/undefined, retorna null
 * Retorna: Address tipado correctamente o null
 */
export function parseAddress(usuario: Usuario): Address | null {
  if (!usuario.address) return null;
  return usuario.address as unknown as Address;
}
