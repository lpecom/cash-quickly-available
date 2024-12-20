import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, MapPin } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const sales = [
  {
    id: "1",
    customer: "João Silva",
    address: "Rua Augusta, 1000",
    items: 2,
    status: "pending",
  },
  {
    id: "2",
    customer: "Maria Santos",
    address: "Av. Paulista, 500",
    items: 1,
    status: "pending",
  },
];

const MotoboySales = () => {
  const handleAddItem = (orderId: string) => {
    toast({
      title: "Produto adicionado",
      description: `Pedido #${orderId}`,
    });
  };

  return (
    <div className="min-h-screen bg-secondary p-4 pb-20">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Vendas</h1>
            <p className="text-sm text-muted-foreground">
              Adicione produtos aos pedidos
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <Package className="w-4 h-4 mr-1" />
            {sales.length}
          </Badge>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-4">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="bg-card rounded-lg shadow-sm p-4 space-y-3"
              >
                <div>
                  <h3 className="font-medium">Pedido #{sale.id}</h3>
                  <p className="text-sm text-muted-foreground">{sale.customer}</p>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span>{sale.address}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">{sale.items} items</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddItem(sale.id)}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MotoboySales;