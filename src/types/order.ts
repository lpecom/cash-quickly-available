export type OrderStatus =
  | "pending"
  | "confirmed"
  | "on_route"
  | "delivered"
  | "not_delivered";

export const orderStatusMap: Record<OrderStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  on_route: "Em rota",
  delivered: "Entregue",
  not_delivered: "Não entregue",
};

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
}

export interface OrderProduct {
  id: string;
  productId: string;
  orderId: string;
  quantity: number;
  product: Product;
}

// Base order type matching Supabase schema
export interface Order {
  id: string;
  customer_name: string;
  customer_id?: string;
  address: string;
  status: OrderStatus;
  total: number;
  phone: string;
  delivery_instructions?: string;
  driver_id?: string;
  created_at: string;
  updated_at: string;
}

// Extended order type for UI with additional fields
export interface OrderWithDetails extends Order {
  products?: OrderProduct[];
  timeline?: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  type: "status_change" | "call" | "message";
  timestamp: Date;
  description: string;
  status?: OrderStatus;
  agent?: string;
}