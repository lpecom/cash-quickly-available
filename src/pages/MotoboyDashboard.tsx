import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Package, MapPin, CheckCircle, XCircle } from "lucide-react";

// Temporary mock data - replace with real API data later
const mockOrders = [
  {
    id: "1",
    customer: "João Silva",
    address: "Rua Augusta, 1000, São Paulo",
    status: "pending",
    amount: "R$ 150,00",
    items: "2 items",
  },
  {
    id: "2",
    customer: "Maria Santos",
    address: "Av. Paulista, 500, São Paulo",
    status: "pending",
    amount: "R$ 89,90",
    items: "1 item",
  },
];

const MotoboyDashboard = () => {
  const [orders, setOrders] = useState(mockOrders);

  const updateOrderStatus = (orderId: string, newStatus: "delivered" | "not_delivered") => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    const message = newStatus === "delivered" 
      ? "Pedido marcado como entregue com sucesso!"
      : "Pedido marcado como não entregue";
      
    toast({
      title: message,
      description: `Pedido #${orderId} atualizado.`,
    });
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Painel do Motoboy</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas entregas do dia
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              <Package className="w-4 h-4 mr-2" />
              {orders.length} entregas pendentes
            </Badge>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {order.address}
                  </TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>
                    <Badge
                      variant={order.status === "delivered" ? "default" : "secondary"}
                    >
                      {order.status === "delivered" ? "Entregue" : "Pendente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => updateOrderStatus(order.id, "delivered")}
                        disabled={order.status === "delivered"}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Entregue
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => updateOrderStatus(order.id, "not_delivered")}
                        disabled={order.status === "delivered"}
                      >
                        <XCircle className="w-4 h-4" />
                        Não entregue
                      </Button>
                    </div>
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

export default MotoboyDashboard;