import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Search, Link as LinkIcon, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LinkProductDialog } from "@/components/seller/LinkProductDialog";

export default function SellerProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("my-products");
  const [linkingProductId, setLinkingProductId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["seller-products"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const linkMutation = useMutation({
    mutationFn: async ({ shopifyProductId, catalogProductId }: { shopifyProductId: string, catalogProductId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: sellerProfile } = await supabase
        .from("seller_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!sellerProfile) throw new Error("Seller profile not found");

      // Get the source product
      const { data: sourceProduct } = await supabase
        .from("products")
        .select("*")
        .eq("id", catalogProductId)
        .single();

      if (!sourceProduct) throw new Error("Product not found");

      // Create the linked product
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
          linked_product_id: catalogProductId,
          active: true
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return newProduct;
    },
    onSuccess: () => {
      toast.success("Produto vinculado com sucesso!");
      setLinkingProductId(null);
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
    },
    onError: (error: Error) => {
      console.error("Error linking product:", error);
      toast.error("Erro ao vincular produto. Por favor, tente novamente.");
    },
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke('sync-shopify-products', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLinkClick = (productId: string) => {
    setLinkingProductId(productId);
  };

  const handleLinkProduct = (catalogProductId: string) => {
    if (!linkingProductId) return;
    
    linkMutation.mutate({
      shopifyProductId: linkingProductId,
      catalogProductId: catalogProductId,
    });
  };

  // ... keep existing code (JSX for the my-products tab)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Meus Produtos</h2>
          <p className="text-muted-foreground">
            Gerencie seus produtos importados
          </p>
        </div>
      </div>

      <Tabs defaultValue="my-products" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="my-products" className="flex-1 max-w-[200px]">
            Meus Produtos
          </TabsTrigger>
          <TabsTrigger value="shopify" className="flex-1 max-w-[200px]">
            Produtos Shopify
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {activeTab === 'shopify' && (
              <Button 
                onClick={() => syncMutation.mutate()} 
                disabled={syncMutation.isPending}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                {syncMutation.isPending ? 'Sincronizando...' : 'Sincronizar Produtos'}
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="shopify" className="mt-6">
          {isLoading ? (
            <div className="text-center py-8">Carregando produtos...</div>
          ) : filteredProducts?.filter(p => p.shopify_id)?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhum produto Shopify encontrado. Clique em sincronizar para importar seus produtos.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts
                ?.filter(p => p.shopify_id)
                .map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardHeader className="space-y-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base line-clamp-1">
                          {product.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleLinkClick(product.id)}
                            disabled={linkMutation.isPending}
                          >
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                          <Badge variant={product.active ? "default" : "secondary"}>
                            {product.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          SKU: {product.sku || "N/A"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-products" className="mt-6">
          {isLoading ? (
            <div className="text-center py-8">Carregando produtos...</div>
          ) : filteredProducts?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhum produto encontrado
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts?.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base line-clamp-1">
                        {product.name}
                      </CardTitle>
                      <Badge variant={product.active ? "default" : "secondary"}>
                        {product.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        SKU: {product.sku || "N/A"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <LinkProductDialog
        isOpen={!!linkingProductId}
        onClose={() => setLinkingProductId(null)}
        onLink={handleLinkProduct}
        isLinking={linkMutation.isPending}
      />
    </div>
  );
}
