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

      if (error) {
        console.error("Error fetching seller profile:", error);
        throw error;
      }
      return data;
    },
  });

  const linkProduct = useMutation({
    mutationFn: async (productId: string) => {
      if (!sellerProfile) throw new Error("Seller profile not found");

      // First, fetch the source product
      const { data: sourceProduct, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (fetchError || !sourceProduct) {
        console.error("Error fetching source product:", fetchError);
        throw new Error("Product not found");
      }

      // Create a new product linked to the original one
      const { data: newProduct, error: insertError } = await supabase
        .from("products")
        .insert({
          name: sourceProduct.name,
          description: sourceProduct.description,
          price: sourceProduct.price,
          sku: sourceProduct.sku,
          variations: sourceProduct.variations,
          stock: sourceProduct.stock,
          supplier_id: sourceProduct.supplier_id,
          seller_id: sellerProfile.id,
          linked_product_id: productId,
          active: true
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating linked product:", insertError);
        throw insertError;
      }

      return newProduct;
    },
    onSuccess: () => {
      toast.success("Produto adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["catalog-products"] });
    },
    onError: (error) => {
      console.error("Error in linkProduct mutation:", error);
      toast.error("Erro ao adicionar produto. Por favor, tente novamente.");
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
                  disabled={linkProduct.isPending}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {linkProduct.isPending ? "Adicionando..." : "Adicionar"}
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