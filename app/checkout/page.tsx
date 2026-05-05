"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  TopBar,
  Card,
  Field,
  Input,
  Button,
  SectionTitle,
  Icon,
} from "@/app/components/ui";

const fmtARS = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState({
    street: "Av. Alem",
    num: "1253",
    apt: "4B",
    zip: "8000",
  });
  const shippingPrice = 7300;
  const steps = ["Dirección", "Pago"];

  const handleNextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      router.push("/orders");
    }
  };

  const handleInputChange =
    (key: keyof typeof addr) => (e: ChangeEvent<HTMLInputElement>) => {
      setAddr({ ...addr, [key]: e.target.value });
    };

  return (
    <div className="pb-32">
      <TopBar back title="Checkout" />
      <div className="pt-4 px-4 pb-2 max-w-[600px] mx-auto">
        <div className="flex gap-1.5 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div
                className={`h-1 rounded-full mb-1.5 transition-colors ${
                  i + 1 <= step ? "bg-forest" : "bg-line-2"
                }`}
              />
              <div
                className={`text-[11px] font-mono font-medium transition-colors ${
                  i + 1 === step ? "text-forest" : "text-ink-3"
                }`}
              >
                0{i + 1} · {s}
              </div>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <SectionTitle eyebrow="Paso 1">Dirección de entrega</SectionTitle>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="col-span-2">
                <Field label="Calle">
                  <Input
                    value={addr.street}
                    onChange={handleInputChange("street")}
                  />
                </Field>
              </div>
              <Field label="Número">
                <Input value={addr.num} onChange={handleInputChange("num")} />
              </Field>
              <Field label="Depto" optional>
                <Input value={addr.apt} onChange={handleInputChange("apt")} />
              </Field>
              <Field label="Código postal">
                <Input value={addr.zip} onChange={handleInputChange("zip")} />
              </Field>
              <Field label="Ciudad">
                <Input value="Bahía Blanca" disabled />
              </Field>
            </div>
            <Card padding={16} className="mt-3.5">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-bone text-olive flex items-center justify-center">
                  <Icon name="truck" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">Envío a domicilio</div>
                  <div className="text-xs text-ink-3">
                    Llega entre el 26 y 28 de abril
                  </div>
                </div>
                <div className="font-bold">{fmtARS(shippingPrice)}</div>
              </div>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <SectionTitle eyebrow="Paso 2">Resumen y pago</SectionTitle>
            <Card padding={16} className="mb-3">
              <div className="text-[13px] text-ink-3 mb-1.5">Entregamos en</div>
              <div className="font-medium">
                {addr.street} {addr.num}, {addr.apt && "depto " + addr.apt}
              </div>
              <div className="text-[13px] text-ink-3">
                Bahía Blanca · {addr.zip}
              </div>
            </Card>
            <Card padding={16} className="mb-3">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-ink-3">Subtotal</span>
                <span>$ 153.000</span>
              </div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-ink-3">Envío</span>
                <span>{fmtARS(shippingPrice)}</span>
              </div>
              <div className="h-px bg-line my-2.5" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>$ 160.300</span>
              </div>
            </Card>
            <Card padding={14} className="flex gap-2.5 items-center mb-3">
              <Icon name="shield" size={20} className="text-success" />
              <span className="text-[13px]">
                Tus datos están protegidos. Pago procesado por Mercado Pago.
              </span>
            </Card>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-paper/95 backdrop-blur-[12px] border-t border-line px-4 py-3 flex gap-2.5 max-w-[600px] mx-auto lgx:left-[240px] lgx:max-w-none">
        {step > 1 && (
          <Button
            variant="secondary"
            onClick={() => setStep(step - 1)}
            icon="arrowLeft"
          >
            Atrás
          </Button>
        )}
        <Button
          full
          size="lg"
          variant="accent"
          iconRight={step < 2 ? "arrowRight" : undefined}
          onClick={handleNextStep}
        >
          {step < 2 ? "Continuar" : "Pagar $ 160.300"}
        </Button>
      </div>
    </div>
  );
}
