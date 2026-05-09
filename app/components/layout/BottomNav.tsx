"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconName } from "../ui";

interface NavItem {
  id: string;
  label: string;
  icon: IconName;
  route: string;
}

export const BottomNav = () => {
  const pathname = usePathname();

  const items: NavItem[] = [
    { id: "home", label: "Inicio", icon: "home", route: "/" },
    { id: "cart", label: "Carrito", icon: "cart", route: "/cart" },
    { id: "fav", label: "Favoritos", icon: "heart", route: "/favorites" },
    { id: "orders", label: "Pedidos", icon: "box", route: "/orders" },
    { id: "me", label: "Cuenta", icon: "user", route: "/account" },
  ];

  // Rutas donde no queremos mostrar la navegación inferior
  const hideOnPaths = ["/login", "/checkout"];
  if (hideOnPaths.includes(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-paper/95 backdrop-blur-[12px] border-t border-line flex justify-around px-1 pt-2 pb-safe-bottom z-50 lgx:hidden">
      {items.map((it) => {
        const isActive =
          pathname === it.route ||
          (it.route !== "/" && pathname.startsWith(it.route));

        return (
          <Link
            key={it.id}
            href={it.route}
            aria-label={it.label}
            className={`flex flex-col items-center gap-[3px] px-3.5 py-1.5 rounded-r2 relative transition-colors ${
              isActive ? "text-forest" : "text-ink-3 hover:text-ink-2"
            }`}
          >
            <Icon name={it.icon} size={22} />
            <span className="text-[10.5px] font-medium">{it.label}</span>
            {isActive && (
              <div className="absolute top-0 w-3.5 h-0.5 bg-forest rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
