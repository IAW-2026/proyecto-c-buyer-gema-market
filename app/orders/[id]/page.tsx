/**
 * Página de detalle de orden — Server Component con datos reales.
 *
 * Obtiene la orden por ID desde la BD y resuelve el producto desde la Seller App.
 * Muestra timeline de estado, datos de entrega y resumen de la compra.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { TopBar, Card, Icon, Pill } from "@/app/components/ui";
import { getOrdenById } from "@/app/lib/db/orden";
import { getProductById } from "@/app/lib/services/seller";
import { UH_STATUS_LABEL } from "@/app/mocks/buyer/data";
import { fmtARS } from "@/app/lib/utils/format";
import type { OrdenStatus } from "@prisma/client";
import type { IconName } from "@/app/components/ui";

export const dynamic = "force-dynamic";

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ id: string }>;
}

// ── Timeline de estados ───────────────────────────────────────────────────────

const TIMELINE: { status: OrdenStatus; label: string; icon: IconName }[] = [
  { status: "awaiting_payment", label: "Pago pendiente", icon: "creditCard" },
  { status: "paid", label: "Pago confirmado", icon: "check" },
  { status: "shipping", label: "En camino", icon: "truck" },
  { status: "delivered", label: "Entregado", icon: "home" },
];

const ORDER_SEQUENCE: OrdenStatus[] = [
  "created",
  "awaiting_payment",
  "paid",
  "shipping",
  "delivered",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusCardColor(status: OrdenStatus) {
  if (status === "delivered") return "bg-success text-paper border-0";
  if (status === "cancelled" || status === "refunded" || status === "disputed")
    return "bg-danger text-paper border-0";
  return "bg-forest text-paper border-0";
}

// ── Componente ────────────────────────────────────────────────────────────────

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Obtener la orden desde la BD
  const orden = await getOrdenById(id);
  if (!orden) notFound();

  // 2. Resolver datos del producto desde la Seller App
  const product = await getProductById(orden.productId);

  const st = UH_STATUS_LABEL[orden.status];
  const currentIdx = ORDER_SEQUENCE.indexOf(orden.status);
  const isFailed = [
    "cancelled",
    "refunded",
    "disputed",
    "shipping_failed",
  ].includes(orden.status);

  const total = Number(orden.totalAmount);
  const unitPrice = Number(orden.unitPrice);

  return (
    <div className="pb-12">
      <TopBar back title={orden.id} />

      <div className="p-4 max-w-[600px] mx-auto">
        {/* ── Estado actual ──────────────────────────────────────────────── */}
        <Card padding={20} className={`${statusCardColor(orden.status)} mb-4`}>
          <div className="text-[11px] font-mono uppercase tracking-[0.1em] opacity-70 mb-1.5">
            Estado actual
          </div>
          <div className="text-[22px] font-semibold mb-1">{st.label}</div>
          <div className="text-[13px] opacity-80">
            {orden.createdAt.toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </Card>

        {/* ── Timeline de seguimiento (solo si no es estado terminal de error) */}
        {!isFailed && (
          <Card padding={20} className="mb-4">
            <h3 className="m-0 mb-4 text-sm font-semibold">Seguimiento</h3>
            <div className="flex flex-col relative">
              {TIMELINE.map((step, i) => {
                const timelineIdx = ORDER_SEQUENCE.indexOf(step.status);
                const done = timelineIdx <= currentIdx;
                const active = timelineIdx === currentIdx;

                return (
                  <div
                    key={step.status}
                    className={`flex gap-3.5 relative ${i < TIMELINE.length - 1 ? "pb-4" : ""}`}
                  >
                    {i < TIMELINE.length - 1 && (
                      <div
                        className={`absolute top-7 left-[13px] bottom-0 w-0.5 transition-colors ${
                          timelineIdx < currentIdx ? "bg-forest" : "bg-line-2"
                        }`}
                      />
                    )}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 relative z-[1] transition-all duration-300 ${
                        done ? "bg-forest text-paper" : "bg-bone text-ink-3"
                      }`}
                      style={
                        active
                          ? { boxShadow: "0 0 0 4px rgba(101,109,74,.2)" }
                          : undefined
                      }
                    >
                      <Icon name={done ? "check" : step.icon} size={14} />
                    </div>
                    <div className="pt-1">
                      <div
                        className={`text-sm ${active ? "font-semibold" : "font-medium"} ${done ? "text-ink" : "text-ink-3"}`}
                      >
                        {step.label}
                      </div>
                      {active && (
                        <div className="text-xs text-ink-3 mt-0.5">
                          En proceso
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* IDs de referencia */}
            {(orden.paymentId || orden.shippingId) && (
              <div className="mt-4 pt-3 border-t border-line space-y-1">
                {orden.paymentId && (
                  <div className="text-xs text-ink-3">
                    Pago: <span className="font-mono">{orden.paymentId}</span>
                  </div>
                )}
                {orden.shippingId && (
                  <div className="text-xs text-ink-3">
                    Envío: <span className="font-mono">{orden.shippingId}</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* ── Producto ────────────────────────────────────────────────────── */}
        <Card padding={16} className="mb-4">
          <h3 className="m-0 mb-3 text-sm font-semibold">Producto</h3>

          <div className="flex gap-3 items-start">
            {product?.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.thumbnail_url}
                alt={product.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-bone flex items-center justify-center shrink-0">
                <Icon name="box" size={24} className="text-ink-3" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium mb-0.5">
                {product?.title ?? "Producto"}
              </div>
              <div className="text-xs text-ink-3 mb-2">
                {orden.quantity > 1
                  ? `×${orden.quantity} unidades`
                  : "1 unidad"}{" "}
                · {fmtARS(unitPrice)} c/u
              </div>
              <Pill tone={st.tone} size="sm">
                {st.label}
              </Pill>
            </div>
          </div>

          {/* Resumen de costos */}
          <div className="mt-4 pt-3 border-t border-line space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-3">Subtotal</span>
              <span>{fmtARS(unitPrice * orden.quantity)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">Envío</span>
              <span>{fmtARS(orden.shippingPrice)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1 border-t border-line">
              <span>Total</span>
              <span>{fmtARS(total)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
