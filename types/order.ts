export interface OrderPayload {
  customer_name: string;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  dropoff_address: string;
  dropoff_lat: number;
  dropoff_lng: number;
}

export interface Order {
  id: string; // ex: ORD-167...
  payload: OrderPayload;
  status: 'Pendente' | 'Em trânsito' | 'Concluído';
  scheduled_for: string;
}