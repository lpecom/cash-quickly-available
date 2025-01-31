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
  description: string | null;
  active: boolean | null;
  created_at: string;
  updated_at: string;
  image_url?: string | null;
}

export interface OrderProduct {
  id: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  order_id: string | null;
  product_id: string | null;
  quantity: number;
  price_at_time: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_id: string | null;
  address: string;
  status: OrderStatus;
  total: number;
  phone: string;
  delivery_instructions: string | null;
  driver_id: string | null;
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
  delivery_started_at: string | null;
  delivery_completed_at: string | null;
  delivery_failure_reason: string | null;
  commission: number | null;
  items?: OrderItem[];
}

export interface TimelineEvent {
  id: string;
  type: "status_change" | "call" | "message";
  timestamp: Date;
  description: string;
  status?: OrderStatus;
  agent?: string;
}