import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Package, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProductsMenu } from "@/components/admin/products/ProductsMenu";
import { Card, CardContent } from "@/components/ui/card";

interface ProductMovement {
  id: string;
  product_id: string;
  supplier_id: string;
  type: 'received' | 'returned';
  quantity: number;
  notes: string | null;
  created_at: string;
  product: {
    name: string;
  };
  supplier: {
    name: string;
  };
}

const AdminInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: movements, isLoading } = useQuery({
    queryKey: ["product-movements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_movements")
        .select(`
          *,
          product:products(name),
          supplier:suppliers(name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch product movements",
          variant: "destructive",
        });
        throw error;
      }

      return data as ProductMovement[];
    },
  });

  const filteredMovements = movements?.filter((movement) =>
    movement.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Admin</span>
          <span>/</span>
          <span className="text-foreground">Movimentações de Estoque</span>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Movimentações de Estoque</h1>
        </div>
      </div>

      <ProductsMenu />

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Input
              placeholder="Buscar movimentações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Carregando movimentações...
                    </TableCell>
                  </TableRow>
                ) : filteredMovements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Nenhuma movimentação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {new Date(movement.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {movement.product.name}
                      </TableCell>
                      <TableCell>{movement.supplier.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {movement.type === 'received' ? (
                            <>
                              <ArrowDownToLine className="h-4 w-4 text-green-500" />
                              <span className="text-green-600">Recebido</span>
                            </>
                          ) : (
                            <>
                              <ArrowUpFromLine className="h-4 w-4 text-blue-500" />
                              <span className="text-blue-600">Devolvido</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{movement.quantity}</TableCell>
                      <TableCell>{movement.notes || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInventory;