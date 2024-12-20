import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Phone, MessageSquare } from "lucide-react";
import { Order, orderStatusMap, Product } from "@/types/order";
import { OrderTimeline } from "@/components/admin/OrderTimeline";
import { toast } from "sonner";

// Mock data - replace with real data later
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Produto 1",
    price: 29.90,
    quantity: 100,
    description: "Descrição do produto 1",
  },
  {
    id: "2",
    name: "Produto 2",
    price: 49.90,
    quantity: 50,
    description: "Descrição do produto 2",
  },
];

const mockEvents = [
  {
    id: "1",
    type: "status_change",
    timestamp: new Date("2024-03-10T10:00:00"),
    description: "Pedido criado",
    status: "pending",
  },
  {
    id: "2",
    type: "call",
    timestamp: new Date("2024-03-10T10:15:00"),
    description: "Ligação realizada para confirmar endereço",
    agent: "Maria Silva",
  },
  {
    id: "3",
    type: "status_change",
    timestamp: new Date("2024-03-10T10:30:00"),
    description: "Pedido confirmado",
    status: "confirmed",
  },
  {
    id: "4",
    type: "message",
    timestamp: new Date("2024-03-10T11:00:00"),
    description: "Mensagem enviada: Seu pedido está sendo preparado",
    agent: "João Santos",
  },
];

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Mock order - replace with real data fetch
  const order: Order = {
    id: orderId || "",
    customer: "João Silva",
    address: "Rua A, 123",
    status: "pending",
    total: 150.00,
    phone: "11999999999",
    products: [
      {
        id: "1",
        productId: "1",
        orderId: orderId || "",
        quantity: 2,
        product: mockProducts[0],
      },
    ],
    createdAt: "2024-03-10T10:00:00",
  };

  const handleAddProduct = () => {
    toast.success("Produto adicionado ao pedido");
  };

  const handleRemoveProduct = (productId: string) => {
    toast.success("Produto removido do pedido");
  };

  const handleCall = () => {
    // In a real implementation, this could integrate with a VOIP service
    window.location.href = `tel:${order.phone}`;
    toast.success("Iniciando chamada...");
  };

  const handleMessage = () => {
    // In a real implementation, this could open a chat interface or WhatsApp
    window.open(`https://wa.me/55${order.phone}`, '_blank');
    toast.success("Abrindo WhatsApp...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pedido #{orderId}</h1>
          <p className="text-muted-foreground">
            Cliente: {order.customer}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCall}>
            <Phone className="mr-2 h-4 w-4" />
            Ligar
          </Button>
          <Button variant="outline" onClick={handleMessage}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Mensagem
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Informações do Cliente</h2>
            <div>
              <p className="font-medium">Nome</p>
              <p>{order.customer}</p>
            </div>
            <div>
              <p className="font-medium">Endereço</p>
              <p>{order.address}</p>
            </div>
            <div>
              <p className="font-medium">Telefone</p>
              <p>{order.phone}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Adicionar Produto</h2>
            <div className="flex gap-4">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">Selecione um produto</option>
                {mockProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-24"
              />
              <Button onClick={handleAddProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço Unit.</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.products.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>R$ {item.product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      R$ {(item.quantity * item.product.price).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProduct(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Histórico do Pedido</h2>
          <OrderTimeline events={mockEvents} />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="text-right">
          <p className="text-lg font-semibold">Total do Pedido</p>
          <p className="text-2xl font-bold">R$ {order.total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;