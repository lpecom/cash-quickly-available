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

export interface Order {
  id: string;
  customer: string;
  address: string;
  status: OrderStatus;
  total: number;
  products: OrderProduct[];
  createdAt: string;
  driverId?: string;
}