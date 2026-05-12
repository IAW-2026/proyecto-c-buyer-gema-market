export interface RequestQuoteParams {
  destination_address: {
    street: string;
    number: string;
    zip: string;
  };
  product_id: string;
  weight_kg: number;
  height_m: number;
  width_m: number;
  depth_m: number;
}
