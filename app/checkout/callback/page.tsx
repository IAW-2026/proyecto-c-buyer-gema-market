/**
 * Checkout Callback Page — Server Component.
 *
 * Página a la que regresa el usuario después del pago en la Payments App.
 *
 * Query params esperados:
 *   ?payment_id=pay_01HXYZ...&status=approved|rejected|cancelled|pending
 *
 * En el flujo mock, la checkout_url generada ya apunta aquí con status=approved,
 * simulando un pago exitoso sin necesidad de Mercado Pago real.
 */

import Link from "next/link";
import { Icon } from "@/app/components/ui";

interface CallbackPageProps {
  searchParams: Promise<{ payment_id?: string; status?: string }>;
}

export default async function CheckoutCallbackPage({
  searchParams,
}: CallbackPageProps) {
  const { payment_id, status } = await searchParams;

  const isApproved = status === "approved";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        {isApproved ? (
          <>
            {/* Éxito */}
            <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-6">
              <Icon name="checkCircle" size={40} className="text-success" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              ¡Pago confirmado!
            </h1>
            <p className="text-ink-3 text-sm mb-1">
              Tu pedido fue registrado correctamente.
            </p>
            {payment_id && (
              <p className="text-[12px] font-mono text-ink-3 mb-6">
                Ref: {payment_id}
              </p>
            )}
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 h-[52px] px-6 rounded-full bg-forest text-paper font-medium text-[15px] hover:opacity-90 transition-opacity"
            >
              Ver mis pedidos
              <Icon name="arrowRight" size={18} />
            </Link>
          </>
        ) : (
          <>
            {/* Error / rechazo */}
            <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-6">
              <Icon name="alertCircle" size={40} className="text-danger" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Pago no completado
            </h1>
            <p className="text-ink-3 text-sm mb-6">
              {status === "rejected"
                ? "El pago fue rechazado. Podés intentarlo de nuevo."
                : status === "cancelled"
                  ? "Cancelaste el pago. Podés volver al carrito cuando quieras."
                  : "Hubo un problema con el pago. Intentá de nuevo."}
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center gap-2 h-[52px] px-6 rounded-full bg-clay text-paper font-medium text-[15px] hover:opacity-90 transition-opacity"
              >
                <Icon name="arrowLeft" size={18} />
                Volver al carrito
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 h-[42px] px-6 rounded-full text-ink-3 text-sm hover:text-ink transition-colors"
              >
                Ir al inicio
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
