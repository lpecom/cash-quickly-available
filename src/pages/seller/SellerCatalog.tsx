import React from "react";
import { Package, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const mockProducts = [
  {
    id: "1",
    name: "Smartphone XYZ",
    description: "Latest model with advanced features",
    price: 1299.99,
    supplier: { name: "Tech Supplies Ltd" },
  },
  {
    id: "2",
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    price: 3499.99,
    supplier: { name: "Computer World" },
  },
  {
    id: "3",
    name: "Wireless Earbuds",
    description: "Premium sound quality with noise cancellation",
    price: 299.99,
    supplier: { name: "Audio Masters" },
  },
  {
    id: "4",
    name: "Smart Watch",
    description: "Track your fitness and stay connected",
    price: 499.99,
    supplier: { name: "Tech Supplies Ltd" },
  }
];

const SellerCatalog = () => {
  const handleImportToShopify = (productId: string) => {
    // This will be implemented later with actual Shopify integration
    toast.success("Produto será importado para o Shopify em breve!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Catálogo</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {mockProducts.length} produtos disponíveis
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[4/3] bg-muted rounded-t-lg flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-1">
                Fornecedor: {product.supplier.name}
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
                  onClick={() => handleImportToShopify(product.id)}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Importar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockProducts.length === 0 && (
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