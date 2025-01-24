import React from "react";
import { Package, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SellerCatalog = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["catalog-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          description,
          price,
          supplier:supplier_id (
            name
          )
        `)
        .is("seller_id", null)
        .eq("active", true);

      if (error) {
        toast.error("Erro ao carregar produtos");
        throw error;
      }

      return data;
    },
  });

  const { data: sellerProfile } = useQuery({
    queryKey: ["seller-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("seller_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const linkProduct = useMutation({
    mutationFn: async (productId: string) => {
      if (!sellerProfile) throw new Error("Seller profile not found");

      const { data: sourceProduct } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (!sourceProduct) throw new Error("Product not found");

      // Create a new product linked to the original one
      const { error } = await supabase
        .from("products")
        .insert({
          ...sourceProduct,
          id: undefined, // Let Supabase generate a new ID
          seller_id: sellerProfile.id,
          linked_product_id: productId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Produto adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["catalog-products"] });
    },
    onError: () => {
      toast.error("Erro ao adicionar produto");
    },
  });

  const handleLinkProduct = (productId: string) => {
    linkProduct.mutate(productId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Catálogo</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Package className="h-12 w-12 text-muted-foreground animate-pulse" />
            <p className="text-muted-foreground text-center mt-4">
              Carregando produtos...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Catálogo</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {products?.length} produtos disponíveis
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[4/3] bg-muted rounded-t-lg flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-1">
                Fornecedor: {product.supplier?.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-primary">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.price)}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleLinkProduct(product.id)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
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