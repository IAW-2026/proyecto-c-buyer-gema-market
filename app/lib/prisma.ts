// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

const generateId = (model: string): string | undefined => {
  const prefixes: Record<string, string> = {
    Usuario: "usr_",
    Orden: "ord_",
    Carrito: "crt_",
    ItemCarrito: "itm_",
  };
  const prefix = prefixes[model];
  return prefix ? `${prefix}${ulid()}` : undefined;
};

// Extends create/createMany para generar IDs automáticamente
// Intercepta el create y createMany para generar IDs automáticamente

const createPrismaClient = () => {
  return new PrismaClient().$extends({
    query: {
      $allModels: {
        async create({ model, args, query }) {
          const data = args.data as { id?: string };
          if (data.id === undefined) {
            const id = generateId(model);
            if (id) {
              data.id = id;
            }
          }
          return query(args);
        },
        async createMany({ model, args, query }) {
          if (Array.isArray(args.data)) {
            for (const item of args.data as { id?: string }[]) {
              if (item.id === undefined) {
                const id = generateId(model);
                if (id) {
                  item.id = id;
                }
              }
            }
          } else if (args.data && typeof args.data === "object") {
            const data = args.data as { id?: string };
            if (data.id === undefined) {
              const id = generateId(model);
              if (id) {
                data.id = id;
              }
            }
          }
          return query(args);
        },
      },
    },
  });
};

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
