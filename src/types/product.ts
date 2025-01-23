import { z } from "zod";

export interface ProductVariation {
  name: string;
  options: string;
}

export const productSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  sku: z.string().min(3, "SKU deve ter pelo menos 3 caracteres"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Preço inválido"),
  variations: z.array(
    z.object({
      name: z.string().min(1, "Nome da variação é obrigatório"),
      options: z.string().min(1, "Opções são obrigatórias"),
    })
  ),
  stock: z.record(z.string(), z.string().regex(/^\d+$/, "Quantidade deve ser um número inteiro")).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;