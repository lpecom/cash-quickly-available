import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Package, Link2, Unlink } from "lucide-react";

interface ProductLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopifyProduct: any;
}

export function ProductLinkDialog({ open, onOpenChange, shopifyProduct }: ProductLinkDialogProps) {
  const queryClient = useQueryClient();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Fetch catalog products
  const { data: catalogProducts, isLoading } = useQuery({
    queryKey: ["catalog-products"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: sellerProfile } = await supabase
        .from("seller_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!sellerProfile) throw new Error("Seller profile not found");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .is("seller_id", null)
        .is("shopify_id", null)
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const linkMutation = useMutation({
    mutationFn: async (catalogProductId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("products")
        .update({ linked_product_id: catalogProductId })
        .eq("shopify_id", shopifyProduct.shopify_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      toast.success("Produto vinculado com sucesso");
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error linking product:", error);
      toast.error("Erro ao vincular produto");
    },
  });

  const unlinkMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("products")
        .update({ linked_product_id: null })
        .eq("shopify_id", shopifyProduct.shopify_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      toast.success("Produto desvinculado com sucesso");
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error unlinking product:", error);
      toast.error("Erro ao desvincular produto");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Vincular Produto do Catálogo</DialogTitle>
          <DialogDescription>
            Selecione um produto do catálogo para vincular ao seu produto do Shopify
          </DialogDescription>
        </DialogHeader>

        {shopifyProduct.linked_product_id && (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Este produto já está vinculado
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => unlinkMutation.mutate()}
              disabled={unlinkMutation.isPending}
            >
              <Unlink className="h-4 w-4 mr-2" />
              Desvincular
            </Button>
          </div>
        )}

        <ScrollArea className="flex-1 pr-4">
          {isLoading ? (
            <div className="text-center py-8">Carregando produtos...</div>
          ) : catalogProducts?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum produto disponível no catálogo
            </div>
          ) : (
            <div className="grid gap-4">
              {catalogProducts?.map((product) => (
                <Card
                  key={product.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedProductId === product.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedProductId(product.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.description}
                        </div>
                        <div className="text-sm">
                          SKU: {product.sku || "N/A"}
                        </div>
                      </div>
                      <div className="font-medium">
                        R$ {product.price.toFixed(2)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => selectedProductId && linkMutation.mutate(selectedProductId)}
            disabled={!selectedProductId || linkMutation.isPending}
          >
            <Package className="h-4 w-4 mr-2" />
            Vincular Produto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}