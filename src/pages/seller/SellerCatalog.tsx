import React from "react";
import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";

const mockProducts = [
  {
    id: "1",
    name: "Smartphone XYZ",
    description: "Latest model with advanced features",
    price: 1299.99,
    supplier: { name: "Tech Supplies Ltd" },
    metrics: {
      sales: 150,
      commission: 2500.00,
      rating: 4.5
    }
  },
  {
    id: "2",
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    price: 3499.99,
    supplier: { name: "Computer World" },
    metrics: {
      sales: 75,
      commission: 5250.00,
      rating: 4.8
    }
  },
  {
    id: "3",
    name: "Wireless Earbuds",
    description: "Premium sound quality with noise cancellation",
    price: 299.99,
    supplier: { name: "Audio Masters" },
    metrics: {
      sales: 300,
      commission: 1500.00,
      rating: 4.2
    }
  }
];

const SellerCatalog = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5" />
        <h1 className="text-2xl font-semibold">Catálogo</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Fornecedor: {product.supplier.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <MetricCard
                  title="Vendas"
                  value={product.metrics.sales.toString()}
                  icon={Package}
                />
                <MetricCard
                  title="Comissão"
                  value={`R$ ${product.metrics.commission.toFixed(2)}`}
                  icon={Package}
                />
                <MetricCard
                  title="Avaliação"
                  value={product.metrics.rating.toString()}
                  icon={Package}
                />
              </div>

              {product.description && (
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
              )}

              <p className="text-lg font-semibold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(product.price)}
              </p>
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