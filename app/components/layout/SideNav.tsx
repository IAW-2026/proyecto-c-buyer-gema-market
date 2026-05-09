"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconName } from "../ui";
import { Avatar } from "../ui/Avatar";

interface NavItem {
  id: string;
  label: string;
  icon: IconName;
  route: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Inicio", icon: "home", route: "/" },
  //{ id: "search", label: "Buscar",    icon: "search", route: "/search" },
  { id: "cart", label: "Carrito", icon: "cart", route: "/cart" },
  { id: "fav", label: "Favoritos", icon: "heart", route: "/favorites" },
  { id: "orders", label: "Pedidos", icon: "box", route: "/orders" },
  { id: "me", label: "Cuenta", icon: "user", route: "/account" },
];

export const SideNav = () => {
  const pathname = usePathname();

  const hideOnPaths = ["/login", "/checkout"];
  if (hideOnPaths.includes(pathname)) return null;

  return (
    <aside className="hidden lgx:flex lgx:fixed lgx:left-0 lgx:top-0 lgx:bottom-0 lgx:z-[60] lgx:flex-col lgx:w-[240px] lgx:shrink-0 lgx:bg-paper lgx:border-r lgx:border-line lgx:px-3.5 lgx:py-5 lgx:h-screen lgx:overflow-y-auto">
      {/* Header matching index.html */}
      <Link
        href="/"
        className="px-1.5 pb-5 flex items-center gap-2.5 w-full text-left active:scale-[0.98] transition-transform"
      >
        <div className="w-8 h-8 rounded-[10px] bg-moss text-paper flex items-center justify-center">
          <Icon name="home" size={16} />
        </div>
        <div>
          <div className="text-sm font-semibold">UniHousing</div>
          <div className="text-[10.5px] text-ink-3 font-mono">Marketplace</div>
        </div>
      </Link>

      <nav aria-label="Navegación principal" className="flex flex-col gap-0.5 flex-1">
        <ul className="flex flex-col gap-0.5 list-none p-0 m-0">
          {/* original index.html filters out search from the sidebar */}
          {NAV_ITEMS.filter((it) => it.id !== "search").map((it) => {
            const isActive =
              pathname === it.route ||
              (it.route !== "/" && pathname.startsWith(it.route));

            return (
              <li key={it.id}>
                <Link
                  href={it.route}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    isActive
                      ? "bg-bone text-olive font-semibold"
                      : "bg-transparent text-ink-2 font-medium hover:bg-bone/50"
                  }`}
                >
                  <Icon name={it.icon} size={18} />
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile matching index.html */}
      <Link
        href="/account"
        className="p-3 bg-bone rounded-r2 w-full text-left active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-2.5 mb-2">
          <Avatar name="Lucía M." size={36} />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold truncate">Lucía M.</div>
            <div className="text-[11px] text-ink-3">Compradora</div>
          </div>
        </div>
      </Link>
    </aside>
  );
};
