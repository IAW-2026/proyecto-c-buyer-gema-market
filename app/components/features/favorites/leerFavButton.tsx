"use client";

import { useOptimistic, useTransition } from "react";
import { Icon } from "@/app/components/ui";
import { toggleFavoriteAction } from "@/app/lib/actions/favorites";

interface FavoriteButtonProps {
  productId: string;
  initialFavorite: boolean;
  className?: string;
}

export default function FavoriteButton({
  productId,
  initialFavorite,
  className = "",
}: FavoriteButtonProps) {
  // useTransition es necesario para ejecutar la acción y disparar useOptimistic
  const [isPending, startTransition] = useTransition();

  // useOptimistic toma el estado real (initialFavorite) y una función para actualizarlo
  const [optimisticFav, addOptimisticFav] = useOptimistic(
    initialFavorite,
    (state, newState: boolean) => newState, // El "reducer" simplemente toma el nuevo valor
  );

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Iniciamos la transición
    startTransition(async () => {
      // 1. Actualizamos la UI instantáneamente de forma optimista
      addOptimisticFav(!optimisticFav);

      try {
        // 2. Llamamos a la Server Action real
        const result = await toggleFavoriteAction(productId);

        if (!result.success) {
          // Si el servidor devuelve error, React revertirá optimisticFav
          // automáticamente al terminar la transición.
          console.error(result.error);
        }
      } catch (err) {
        // Errores de red también disparan el rollback automático
        console.error("Error de red:", err);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={optimisticFav ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={`flex items-center justify-center transition-colors ${className} ${
        optimisticFav ? "text-forest" : "text-ink-2 hover:text-forest"
      } ${isPending ? "opacity-70" : ""}`}
    >
      <Icon
        name="heart"
        size={16}
        className={optimisticFav ? "[fill:currentColor]" : ""}
      />
    </button>
  );
}
