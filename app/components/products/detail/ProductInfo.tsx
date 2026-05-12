"use client";

import { Pill, Card, Icon } from "@/app/components/ui";
import { fmtARS } from "@/app/lib/utils/format";

interface ProductInfoProps {
  title: string;
  price: number;
  stock: number;
  status: string;
}

export default function ProductInfo({ title, price, stock, status }: ProductInfoProps) {
  const condition = status === "new" ? "Nuevo" : "Usado";
  const location = "Bahía Blanca"; // Simulated location
  const shipping = 5000; // Simulated shipping

  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 mb-2">
        <Pill tone="sage" size="sm">
          {condition}
        </Pill>
        <Pill tone="outline" size="sm" icon="pin">
          {location}
        </Pill>
      </div>
      <h1 className="text-2xl tracking-[-0.02em] font-semibold m-0 mb-2">
        {title}
      </h1>
      <div className="flex items-center gap-3 mb-4 text-[13px] text-ink-2">
        <span className="text-ink-3">{stock} disponibles</span>
      </div>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-[32px] font-bold tracking-[-0.02em]">
          {fmtARS(price)}
        </span>
      </div>

      {/* Card de envío */}
      <Card padding={14} className="mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bone flex items-center justify-center">
            <Icon name="truck" size={20} className="text-moss" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-medium">
              Envío a {location}
            </div>
            <div className="text-xs text-ink-3">Llega pronto</div>
          </div>
          <span className="font-semibold text-sm">
            {shipping > 0 ? fmtARS(shipping) : "Gratis"}
          </span>
        </div>
      </Card>
    </div>
  );
}
