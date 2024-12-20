import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mock data - replace with real API data later
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
      description: `Um novo produto foi adicionado ao pedido #${orderId}`,
    });
  };

  return (
    <div className="min-h-screen bg-secondary p-4 pb-20 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Vendas</h1>
            <p className="text-muted-foreground mt-1">Adicione produtos aos pedidos</p>
          </div>
          <Badge variant="outline" className="px-4 py-2">
            <Package className="w-4 h-4 mr-2" />
            {sales.length} pedidos
          </Badge>
        </div>

        <div className="bg-card rounded-lg shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>#{sale.id}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{sale.address}</TableCell>
                  <TableCell>{sale.items} items</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleAddItem(sale.id)}
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MotoboySales;