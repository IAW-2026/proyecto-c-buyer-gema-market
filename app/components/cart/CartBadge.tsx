import { getCartItemCount } from "@/app/lib/helpers/cart";

export async function CartBadge() {
  const count = await getCartItemCount();
  if (count === 0) return null;

  return (
    <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1.5 rounded-full bg-forest text-paper text-[10px] font-bold flex items-center justify-center">
      {count > 99 ? "99+" : count}
    </span>
  );
}
