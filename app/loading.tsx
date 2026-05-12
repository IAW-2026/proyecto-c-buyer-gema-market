import React from "react";
import { Logo } from "./components/ui/Logo";

/**
 * Loading global de la aplicación.
 * Aparece durante las transiciones de página de alto nivel.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative flex flex-col items-center">
        {/* Logo con animación de pulso */}
        <div className="mb-6 animate-pulse">
          <Logo size={48} />
        </div>

        {/* Spinner elegante */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-1 w-32 overflow-hidden rounded-full bg-bone">
            <div className="h-full w-1/3 animate-[shimmer_1.5s_infinite_linear] rounded-full bg-forest" />
          </div>
          <span className="text-xs font-mono text-ink-3 animate-pulse">
            Cargando UniHousing...
          </span>
        </div>
      </div>
    </div>
  );
}
