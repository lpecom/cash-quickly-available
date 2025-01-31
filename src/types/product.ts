import { z } from "zod";

export interface ProductVariation {
  name: string;
  options: string;
}

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  sku: string;
  supplier_id?: string;
  variations: ProductVariation[];
  stock: Record<string, string>;
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