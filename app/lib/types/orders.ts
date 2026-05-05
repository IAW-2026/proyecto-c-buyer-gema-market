export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: number;
  total: number;
  buyer: string;
  address: string;
  trackId: string;
}

export type OrderStatus =
  | "pago_pendiente"
  | "preparando"
  | "listo_envio"
  | "en_camino"
  | "entregado"
  | "cancelado";
