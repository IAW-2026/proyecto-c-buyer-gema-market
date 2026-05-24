import Image from "next/image";
import type { Shop } from "@/app/lib/types/product";
import { Card } from "@/app/components/ui/Card";
import { Avatar } from "@/app/components/ui/Avatar";
import { Pill } from "@/app/components/ui/Pill";

interface ShopHeaderProps {
  shop: Shop;
}

export function ShopHeader({ shop }: ShopHeaderProps) {
  return (
    <Card padding={0} className="mb-[18px]">
      {/* Cover — overflow-hidden aquí para clipear imagen/gradiente sin afectar al avatar */}
      <div className="h-[150px] relative overflow-hidden rounded-t-r3 min-[600px]:h-[190px] lgx:h-[220px]">
        {shop.cover_url ? (
          <Image
            src={shop.cover_url}
            alt={`Portada de ${shop.shop_name}`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-clay to-bark" />
        )}
        <div className="absolute right-[18px] bottom-[18px] flex gap-2 flex-wrap justify-end">
          <Pill tone="glass" icon="pin" size="sm">
            {shop.city}
          </Pill>
        </div>
      </div>

      {/* Body */}
      <div className="px-[18px] pb-5 lgx:px-6 lgx:pb-6">
        {/*
          relative z-10: el cover tiene position:relative (para Image fill),
          lo que lo eleva sobre elementos estáticos en el orden de pintura.
          Con z-10 acá el avatar queda siempre encima del cover.
        */}
        <div className="flex gap-4 items-start -mt-[42px] mb-4 relative z-10">
          <div className="p-1 rounded-full bg-paper shadow-sh-1 shrink-0">
            <Avatar src={shop.logo_url} name={shop.shop_name} size={76} />
          </div>
          <div className="min-w-0 pt-[46px]">
            <h1 className="m-0 text-[26px] font-bold">{shop.shop_name}</h1>
            <div className="flex gap-2 items-center flex-wrap text-ink-3 text-[13px] mt-1">
              <span className="hidden lgx:inline">{shop.city}</span>
              <span className="hidden lgx:inline">·</span>
              <span>{shop.total_products} productos</span>
            </div>
          </div>
        </div>

        {shop.bio && (
          <p className="m-0 mb-4 text-ink-2 leading-[1.5]">
            {shop.bio}
          </p>
        )}

        <div className="grid grid-cols-2 lgx:grid-cols-3 gap-2.5">
          <div className="bg-bone rounded-r2 p-2 lgx:p-3">
            <div className="text-[11px] text-ink-3">Productos</div>
            <div className="text-base font-bold lgx:text-xl">
              {shop.total_products}
            </div>
          </div>
          <div className="bg-bone rounded-r2 p-2 lgx:p-3">
            <div className="text-[11px] text-ink-3">Categorías</div>
            <div className="text-base font-bold lgx:text-xl">
              {shop.categories.length}
            </div>
          </div>
          <div className="hidden lgx:block bg-bone rounded-r2 p-2 lgx:p-3">
            <div className="text-[11px] text-ink-3">Ciudad</div>
            <div className="text-base font-bold lgx:text-xl truncate">
              {shop.city}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
