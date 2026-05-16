import { Suspense } from "react";
import Link from "next/link";
import { Card, Icon } from "@/app/components/ui";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth/roles";
import { AdminDashboardSkeleton } from "./_components/AdminDashboardSkeleton";

const SECTIONS = [
  {
    href: "/admin/usuarios",
    label: "Usuarios",
    icon: "user" as const,
    key: "usuarios" as const,
    enabled: true,
  },
  {
    href: "/admin/ordenes",
    label: "Órdenes",
    icon: "box" as const,
    key: "ordenes" as const,
    enabled: false,
  },
  {
    href: "/admin/carritos",
    label: "Carritos",
    icon: "cart" as const,
    key: "carritos" as const,
    enabled: false,
  },
  {
    href: "/admin/favoritos",
    label: "Favoritos",
    icon: "heart" as const,
    key: "favoritos" as const,
    enabled: false,
  },
];

async function AdminDashboardContent() {
  await requireAdmin();
  const [usuarios, ordenes, carritos, favoritos] = await Promise.all([
    prisma.usuario.count(),
    prisma.orden.count(),
    prisma.carrito.count(),
    prisma.favorito.count(),
  ]);
  const counts = { usuarios, ordenes, carritos, favoritos };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lgx:grid-cols-4 gap-3.5">
      {SECTIONS.map((s) => {
        const content = (
          <Card hover={s.enabled} className="h-full">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-bone flex items-center justify-center text-olive">
                <Icon name={s.icon} size={20} />
              </div>
              {!s.enabled && (
                <span className="text-[10.5px] font-mono uppercase tracking-[0.08em] text-ink-3">
                  Próximamente
                </span>
              )}
            </div>
            <div className="text-2xl font-semibold tracking-[-0.02em]">
              {counts[s.key]}
            </div>
            <div className="text-sm text-ink-3">{s.label}</div>
          </Card>
        );

        return s.enabled ? (
          <Link key={s.href} href={s.href} className="block">
            {content}
            {/* El bloque de contenido se envuelve en un Link solo si la sección está habilitada */}
          </Link>
        ) : (
          <div key={s.href}>{content}</div>
        );
      })}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
