export type ULID = string;

export enum UserRole {
  BUYER = "buyer",
  SELLER = "seller", // Puede coexistir
}

export interface Usuario {
  id: ULID;
  clerk_user_id: string;
  email: string;
  full_name: string;
  address: string; // JSON
  role: UserRole;
  created_at: Date | string;
}

export type OrderStatus =
  | "created"
  | "awaiting_payment"
  | "paid"
  | "shipping"
  | "delivered"
  | "shipping_failed"
  | "cancelled"
  | "refunded"
  | "disputed";

export interface Orden {
  id: ULID;
  buyer_id: ULID;
  seller_id: string; // FK lógica
  product_id: string; // FK lógica
  quantity: number;
  unit_price: number;
  quote_id: string; // FK lógica
  shipping_price: number;
  total_amount: number;
  currency: string; // "ARS"
  status: OrderStatus;
  payment_id: string; // FK lógica
  shipping_id: string; // FK lógica
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Carrito {
  id: ULID;
  buyer_id: ULID;
  created_at: Date | string;
}

export interface ItemCarrito {
  id: ULID;
  carrito_id: ULID;
  product_id: string; // FK lógica
  quantity: number;
  added_at: Date | string;
}

export interface Favorito {
  buyer_id: ULID;
  product_id: string; // FK lógica
  created_at: Date | string;
}
