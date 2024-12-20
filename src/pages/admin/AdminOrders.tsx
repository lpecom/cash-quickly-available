import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Eye } from "lucide-react";
import { Order, orderStatusMap } from "@/types/order";
import { Link } from "react-router-dom";

// Mock data - replace with real data later
const mockOrders: Order[] = [
  {
    id: "1",
    customer: "João Silva",
    address: "Rua A, 123",
    status: "pending",
    total: 150.00,
    products: [],
    createdAt: "2024-03-10T10:00:00",
  },
  {
    id: "2",
    customer: "Maria Santos",
    address: "Av B, 456",
    status: "confirmed",
    total: 89.90,
    products: [],
    createdAt: "2024-03-10T09:30:00",
  },
  {
    id: "3",
    customer: "Pedro Oliveira",
    address: "Rua C, 789",
    status: "on_route",
    total: 245.50,
    products: [],
    createdAt: "2024-03-10T09:00:00",
  },
  {
    id: "4",
    customer: "Ana Costa",
    address: "Av D, 321",
    status: "delivered",
    total: 175.00,
    products: [],
    createdAt: "2024-03-09T18:00:00",
  },
] as Order[];

const getStatusColor = (status: Order["status"]) => {
  const colors = {
    pending: "bg-yellow-500",
    confirmed: "bg-blue-500",
    on_route: "bg-purple-500",
    delivered: "bg-green-500",
    not_delivered: "bg-red-500",
  };
  return colors[status] || "bg-gray-500";
};

const AdminOrders = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <Button asChild>
          <Link to="/admin/orders/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Pedido
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>
                  <Select defaultValue={order.status}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue>
                        <Badge className={getStatusColor(order.status)}>
                          {orderStatusMap[order.status]}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(orderStatusMap).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/admin/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;