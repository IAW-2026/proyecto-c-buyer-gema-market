import type { BatchProductItem } from "./product";

export interface CartItemWithProduct extends BatchProductItem {
  quantity: number;
  item_id: string;
}
