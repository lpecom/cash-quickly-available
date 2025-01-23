import { z } from "zod";

export interface ProductFormValues {
  name: string;
  description: string;
  price: string; // Changed from number to string to match form input
  sku: string;
  supplier_id?: string;
  variations: ProductVariation[];
  stock: Record<string, string>; // Added stock field
}

export interface ProductVariation {
  name: string;
  options: string; // Changed to string since we handle comma-separated values
}

export const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.string().min(1, "Preço é obrigatório"),
  sku: z.string().optional(),
  supplier_id: z.string().optional(),
  variations: z.array(
    z.object({
      name: z.string(),
      options: z.string()
    })
  ).optional(),
  stock: z.record(z.string(), z.string()).optional()
});

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
  status: string;
  total: number;
  phone: string;
  delivery_instructions: string | null;
  driver_id: string | null;
  created_at: string;
  updated_at: string;
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
