"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/ui";
import FavoriteButton from "../../features/favorites/FavoriteButton";

interface ProductImageGalleryProps {
  thumbnailUrl?: string | null;
  title: string;
  productId: string;
  initialFavorite?: boolean;
}

export default function ProductImageGallery({
  thumbnailUrl,
  title,
  productId,
  initialFavorite = false,
}: ProductImageGalleryProps) {
  const router = useRouter();

  return (
    <div className="lgx:sticky lgx:top-6">
      <div className="aspect-square max-h-130 flex items-center justify-center relative min-[600px]:max-w-140 min-[600px]:mx-auto min-[600px]:rounded-r3 min-[600px]:overflow-hidden min-[600px]:border min-[600px]:border-line lgx:max-w-none lgx:rounded-r3 lgx:overflow-hidden lgx:border lgx:border-line lgx:shadow-sh-1 bg-bone">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            priority
            loading="eager"
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <Icon name="box" size={64} className="text-ink-3/30" />
        )}

        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <button
            onClick={() => router.back()}
            aria-label="Volver"
            className="w-10 h-10 rounded-full bg-paper/95 flex items-center justify-center shadow-sh-1 active:scale-90 transition-transform"
          >
            <Icon name="arrowLeft" size={18} />
          </button>
          <div className="flex gap-2">
            <FavoriteButton
              productId={productId}
              initialFavorite={initialFavorite}
              className="w-10 h-10 rounded-full bg-paper/95 shadow-sh-1 active:scale-90"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
