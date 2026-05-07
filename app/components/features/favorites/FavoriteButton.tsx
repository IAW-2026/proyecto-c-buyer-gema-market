"use client";

import { useState } from "react";
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
  const [isFav, setIsFav] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Evita navegar si el botón está dentro de un <Link>
    e.stopPropagation();

    if (isLoading) return;

    // 1. Actualización optimista (inmediata)
    const previousState = isFav;
    setIsFav(!isFav);
    setIsLoading(true);

    // 2. Petición al servidor
    try {
      const result = await toggleFavoriteAction(productId);

      // 3. Rollback en caso de error
      if (!result.success) {
        setIsFav(previousState);
        alert(result.error || "Hubo un error al guardar el favorito.");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setIsFav(previousState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={`flex items-center justify-center transition-colors ${className} ${
        isFav ? "text-forest" : "text-ink-2 hover:text-forest"
      }`}
    >
      <Icon
        name="heart"
        size={16}
        className={isFav ? "[fill:currentColor]" : ""}
      />
    </button>
  );
}
