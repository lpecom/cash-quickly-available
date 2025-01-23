import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductsMenu } from "@/components/admin/products/ProductsMenu";

export default function AdminSuppliers() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Admin</span>
          <span>/</span>
          <span className="text-foreground">Suppliers</span>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Fornecedores</h1>
        </div>
      </div>

      <ProductsMenu />

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            Página em desenvolvimento
          </div>
        </CardContent>
      </Card>
    </div>
  );
}