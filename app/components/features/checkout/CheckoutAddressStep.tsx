import { ChangeEvent } from "react";
import { Field, Input, SectionTitle, Card, Icon } from "@/app/components/ui";

export interface Address {
  street: string;
  number: string;
  apt: string;
  zip: string;
}

interface CheckoutAddressStepProps {
  addr: Address;
  handleInput: (key: keyof Address) => (e: ChangeEvent<HTMLInputElement>) => void;
}

export function CheckoutAddressStep({
  addr,
  handleInput,
}: CheckoutAddressStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <SectionTitle eyebrow="Paso 1">Dirección de entrega</SectionTitle>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="col-span-2">
          <Field label="Calle">
            <Input
              value={addr.street}
              onChange={handleInput("street")}
              placeholder="Av. Colón"
            />
          </Field>
        </div>
        <Field label="Número">
          <Input
            value={addr.number}
            onChange={handleInput("number")}
            placeholder="1234"
          />
        </Field>
        <Field label="Depto" optional>
          <Input
            value={addr.apt}
            onChange={handleInput("apt")}
            placeholder="3B"
          />
        </Field>
        <Field label="Código postal">
          <Input
            value={addr.zip}
            onChange={handleInput("zip")}
            placeholder="8000"
          />
        </Field>
        <Field label="Ciudad">
          <Input value="Bahía Blanca" disabled />
        </Field>
      </div>

      <Card
        padding={14}
        className="flex gap-2.5 items-center mt-2 text-[13px] text-ink-3"
      >
        <Icon name="info" size={15} className="shrink-0" />
        Al continuar, cotizaremos el envío para cada producto de tu carrito.
      </Card>
    </div>
  );
}
