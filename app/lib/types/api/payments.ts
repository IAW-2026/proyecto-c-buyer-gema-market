export interface PaymentOrderItem {
  order_id: string;
  seller_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  quote?: {
    quote_id: string;
    shipping_price: number;
  };
}

export interface CreatePaymentOrderParams {
  buyer_id: string;
  orders: PaymentOrderItem[];
  currency?: string;
  return_url: string;
}
