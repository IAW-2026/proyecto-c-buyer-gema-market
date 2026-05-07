"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TopBar,
  Tabs,
  Card,
  Pill,
  ProductGlyph,
  Icon,
  EmptyState,
} from "@/app/components/ui";
import {
  UH_ORDERS as orders,
  UH_STATUS_LABEL,
  UH_PRODUCTS,
} from "@/app/mocks/buyer/data";
import { fmtARS } from "@/app/lib/utils/format";

export default function OrdersPage() {
  const router = useRouter();
  const [tab, setTab] = useState("activos");

  const filtered =
    tab === "activos"
      ? orders.filter(
          (o) => o.status !== "delivered" && o.status !== "cancelled",
        )
      : orders.filter((o) => o.status === "delivered");

  return (
    <div className="pb-6">
      <TopBar title="Mis pedidos" />
      <div className="px-4">
        <Tabs
          tabs={[
            {
              id: "activos",
              label: "Activos",
              count: orders.filter((o) => o.status !== "delivered").length,
            },
            {
              id: "historial",
              label: "Historial",
              count: orders.filter((o) => o.status === "delivered").length,
            },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>
      <div className="p-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon="box"
            title="Sin pedidos por ahora"
            body={
              tab === "activos"
                ? "Cuando hagas una compra aparece acá."
                : "Tu historial está vacío."
            }
          />
        ) : (
          filtered.map((o) => {
            const st = UH_STATUS_LABEL[o.status];
            return (
              <Card
                key={o.id}
                padding={16}
                onClick={() => router.push("/orders/" + o.id)}
                hover
              >
                <div className="flex justify-between items-center mb-2.5">
                  <div className="text-xs font-mono text-ink-3">{o.id}</div>
                  <Pill tone={st.tone} size="sm">
                    {st.label}
                  </Pill>
                </div>
                <div className="flex gap-2 mb-3">
                  {[0, 1].slice(0, o.items).map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-[10px] flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${UH_PRODUCTS[i].palette[0]}55, ${UH_PRODUCTS[i].palette[1]}55)`,
                      }}
                    >
                      <ProductGlyph
                        kind={UH_PRODUCTS[i].glyph}
                        palette={UH_PRODUCTS[i].palette}
                        size={28}
                      />
                    </div>
                  ))}
                  {o.items > 2 && (
                    <div className="w-12 h-12 rounded-[10px] bg-bone flex items-center justify-center text-xs font-semibold text-olive">
                      +{o.items - 2}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[13px] text-ink-3">
                      {o.date} · {o.items}{" "}
                      {o.items === 1 ? "artículo" : "artículos"}
                    </div>
                    <div className="text-base font-semibold">
                      {fmtARS(o.total)}
                    </div>
                  </div>
                  <Icon name="chevronRight" size={18} className="text-ink-3" />
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
