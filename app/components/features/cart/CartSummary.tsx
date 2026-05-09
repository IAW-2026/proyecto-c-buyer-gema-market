import { Button } from "@/app/components/ui";
import { fmtARS } from "@/app/lib/utils/format";

interface CartSummaryProps {
  subtotal: number;
  ship: number;
  total: number;
  onCheckout: () => void;
}

/**
 * Componente que muestra el resumen de costos y el botón de acción principal.
 */
export function CartSummary({
  subtotal,
  ship,
  total,
  onCheckout,
}: CartSummaryProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-paper/95 backdrop-blur-[12px] border-t border-line px-4 py-3 z-50 lgx:left-[240px]">
      <div className="w-full max-w-[760px] mx-auto">
        <div className="grid gap-1.5 text-[13px] mb-3">
          <div className="flex justify-between">
            <span className="text-ink-3">Subtotal</span>
            <span>{fmtARS(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-3">Envío</span>
            <span>{fmtARS(ship)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-1.5 border-t border-line">
            <span>Total</span>
            <span>{fmtARS(total)}</span>
          </div>
        </div>
        <Button
          full
          size="lg"
          variant="accent"
          iconRight="arrowRight"
          onClick={onCheckout}
        >
          Continuar al checkout
        </Button>
      </div>
    </div>
  );
}
