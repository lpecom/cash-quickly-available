import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SellerCatalog = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          supplier:suppliers(name)
        `)
        .eq("active", true);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Catálogo</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-4 w-1/4 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-3/4 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5" />
        <h1 className="text-2xl font-semibold">Catálogo</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Fornecedor: {product.supplier.name}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(product.price)}
              </p>
              {product.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {product.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {products?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhum produto disponível no momento.
              <br />
              Os produtos adicionados pelos fornecedores aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SellerCatalog;