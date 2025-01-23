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
import { Plus, Edit2, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProductsMenu } from "@/components/admin/products/ProductsMenu";
import { Card, CardContent } from "@/components/ui/card";

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  active: boolean;
}

const AdminSuppliers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch suppliers",
          variant: "destructive",
        });
        throw error;
      }

      return data as Supplier[];
    },
  });

  const toggleSupplierStatus = useMutation({
    mutationFn: async ({ supplierId, active }: { supplierId: string; active: boolean }) => {
      const { error } = await supabase
        .from("suppliers")
        .update({ active })
        .eq("id", supplierId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast({
        title: "Success",
        description: "Supplier status updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating supplier:", error);
      toast({
        title: "Error",
        description: "Failed to update supplier status",
        variant: "destructive",
      });
    },
  });

  const filteredSuppliers = suppliers?.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Admin</span>
          <span>/</span>
          <span className="text-foreground">Fornecedores</span>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <Truck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Fornecedores</h1>
        </div>
      </div>

      <ProductsMenu />

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Input
              placeholder="Buscar fornecedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={() => navigate("/admin/products/suppliers/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Fornecedor
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Carregando fornecedores...
                    </TableCell>
                  </TableRow>
                ) : filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Nenhum fornecedor encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">
                        {supplier.name}
                      </TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.phone || "-"}</TableCell>
                      <TableCell>
                        {supplier.active ? (
                          <span className="text-green-600">Ativo</span>
                        ) : (
                          <span className="text-red-600">Inativo</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/products/suppliers/${supplier.id}`)
                            }
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={supplier.active ? "destructive" : "default"}
                            size="sm"
                            onClick={() =>
                              toggleSupplierStatus.mutate({
                                supplierId: supplier.id,
                                active: !supplier.active,
                              })
                            }
                          >
                            {supplier.active ? "Desativar" : "Ativar"}
                          </Button>
                        </div>
                      </TableCell>
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

export default AdminSuppliers;