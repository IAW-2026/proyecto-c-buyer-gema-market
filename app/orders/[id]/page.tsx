"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  TopBar,
  Card,
  Icon,
  Pill,
  ProductGlyph,
  Button,
} from "@/app/components/ui";
import {
  UH_ORDERS as orders,
  UH_STATUS_LABEL,
  UH_PRODUCTS,
  OrderStatus,
} from "@/app/lib/data";

const fmtARS = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const o = orders.find((x) => x.id === id) || orders[0];
  const st = UH_STATUS_LABEL[o.status];

  const steps = [
    { id: "pago_pendiente", label: "Pago confirmado", icon: "check" },
    { id: "preparando", label: "Preparando tu pedido", icon: "box" },
    { id: "listo_envio", label: "Listo para envío", icon: "pkg" },
    { id: "en_camino", label: "En camino", icon: "truck" },
    { id: "entregado", label: "Entregado", icon: "home" },
  ];

  const orderSequence: OrderStatus[] = [
    "pago_pendiente",
    "preparando",
    "listo_envio",
    "en_camino",
    "entregado",
  ];

  const currentIdx = orderSequence.indexOf(o.status);

  return (
    <div className="pb-32">
      <TopBar back title={o.id} />
      <div className="p-4">
        <Card padding={20} className="bg-forest text-paper border-0 mb-4">
          <div className="text-[11px] font-mono uppercase tracking-[0.1em] opacity-70 mb-2">
            Estado actual
          </div>
          <div className="text-[22px] font-semibold mb-1.5">{st.label}</div>
          <div className="text-[13px] opacity-80">
            Llega entre el 26 y 28 de abril
          </div>
        </Card>

        <Card padding={20} className="mb-4">
          <h3 className="m-0 mb-4 text-sm font-semibold">Tracking</h3>
          <div className="flex flex-col relative">
            {steps.map((s, i) => {
              const done = i <= currentIdx;
              const active = i === currentIdx;
              return (
                <div
                  key={s.id}
                  className={`flex gap-3.5 relative ${
                    i === steps.length - 1 ? "" : "pb-4"
                  }`}
                >
                  {i < steps.length - 1 && (
                    <div
                      className={`absolute top-7 left-[13px] bottom-0 w-0.5 transition-colors ${
                        i < currentIdx ? "bg-forest" : "bg-line-2"
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
                    <Icon name={done ? "check" : s.icon} size={14} />
                  </div>
                  <div className="pt-1">
                    <div
                      className={`text-sm ${
                        active ? "font-semibold" : "font-medium"
                      } ${done ? "text-ink" : "text-ink-3"}`}
                    >
                      {s.label}
                    </div>
                    {active && (
                      <div className="text-xs text-ink-3 mt-0.5 animate-in fade-in slide-in-from-top-1">
                        Hace 2 horas · Repartidor: Marcos R.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding={16} className="mb-4">
          <div className="text-[13px] text-ink-3 mb-1">Dirección</div>
          <div className="font-medium">{o.address}</div>
          <div className="text-[13px] text-ink-3 mt-1.5">
            Tracking: <span className="font-mono">{o.trackId}</span>
          </div>
        </Card>

        <Card padding={16} className="mb-4">
          <h3 className="m-0 mb-3 text-sm font-semibold">Productos</h3>
          {[0, 1].slice(0, o.items).map((i) => {
            const p = UH_PRODUCTS[i];
            return (
              <div
                key={i}
                className="flex gap-3 items-center pb-3 mb-3 border-b border-line"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${p.palette[0]}33, ${p.palette[1]}33)`,
                  }}
                >
                  <ProductGlyph kind={p.glyph} palette={p.palette} size={36} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.title}</div>
                  <div className="text-xs text-ink-3">{p.seller}</div>
                </div>
                <div className="font-semibold">{fmtARS(p.price)}</div>
              </div>
            );
          })}
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{fmtARS(o.total)}</span>
          </div>
        </Card>

        {o.status === "entregado" && (
          <Button variant="danger" full icon="alert">
            Iniciar disputa
          </Button>
        )}
      </div>
    </div>
  );
}
