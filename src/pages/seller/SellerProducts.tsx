import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SellerProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("my-products");

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

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

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

        <TabsContent value="shopify" className="mt-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Conecte sua loja Shopify para importar produtos
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}