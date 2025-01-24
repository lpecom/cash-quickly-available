import { useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LinkProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLink: (catalogProductId: string) => void;
  isLinking: boolean;
}

export function LinkProductDialog({ isOpen, onClose, onLink, isLinking }: LinkProductDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: catalogProducts } = useQuery({
    queryKey: ["catalog-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .is("seller_id", null)
        .eq("active", true);

      if (error) throw error;
      return data;
    },
  });

  const filteredProducts = catalogProducts?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Vincular Produto do Catálogo</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar no catálogo..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {filteredProducts?.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="space-y-2">
                <CardTitle className="text-base line-clamp-1">
                  {product.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onLink(product.id)}
                    disabled={isLinking}
                  >
                    {isLinking ? "Vinculando..." : "Vincular"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}