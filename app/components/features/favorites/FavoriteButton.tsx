"use client";

import { useOptimistic, useTransition } from "react";
import { Icon } from "@/app/components/ui";
import { toggleFavoriteAction } from "@/app/lib/actions/favorites";

interface FavoriteButtonProps {
  productId: string;
  initialFavorite: boolean;
  className?: string; // Para permitir estilos custom desde el padre
}

export default function FavoriteButton({
  productId,
  initialFavorite,
  className = "",
}: FavoriteButtonProps) {
  // useTransition es necesario para que useOptimistic funcione correctamente
  // ya que las actualizaciones optimistas deben ocurrir dentro de una transición.
  const [isPending, startTransition] = useTransition();

  // useOptimistic toma el estado base (que viene del servidor) y una función reducer.
  // Si la acción termina y el estado base no cambió a lo esperado, React revierte automáticamente.
  const [optimisticIsFav, addOptimisticIsFav] = useOptimistic(
    initialFavorite,
    (state, newState: boolean) => newState,
  );

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Evita navegar si el botón está dentro de un <Link>
    e.stopPropagation();

    // Iniciamos la transición para la Server Action
    startTransition(async () => {
      // 1. Actualización optimista inmediata
      addOptimisticIsFav(!optimisticIsFav);

      try {
        // 2. Ejecución de la acción en el servidor
        const result = await toggleFavoriteAction(productId);

        if (!result.success) {
          // Si el servidor falla, React revertirá optimisticIsFav al valor de initialFavorite
          // automáticamente al finalizar esta función de transición.
          console.error("Error al guardar favorito:", result.error);
        }
      } catch (error) {
        console.error("Error de red al alternar favorito:", error);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={
        optimisticIsFav ? "Quitar de favoritos" : "Agregar a favoritos"
      }
      className={`flex items-center justify-center transition-colors ${className} ${
        optimisticIsFav ? "text-forest" : "text-ink-2 hover:text-forest"
      } ${isPending ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      <Icon
        name="heart"
        size={16}
        className={optimisticIsFav ? "[fill:currentColor]" : ""}
      />
    </button>
  );
}
