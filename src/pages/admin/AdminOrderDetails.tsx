import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Order, Product } from "@/types/order";
import { OrderTimeline } from "@/components/admin/OrderTimeline";
import { OrderCustomerInfo } from "@/components/admin/OrderCustomerInfo";
import { OrderProductList } from "@/components/admin/OrderProductList";
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
    type: "status_change" as const,
    timestamp: new Date("2024-03-10T10:00:00"),
    description: "Pedido criado",
    status: "pending" as const,
  },
  {
    id: "2",
    type: "call" as const,
    timestamp: new Date("2024-03-10T10:15:00"),
    description: "Ligação realizada para confirmar endereço",
    agent: "Maria Silva",
  },
  {
    id: "3",
    type: "status_change" as const,
    timestamp: new Date("2024-03-10T10:30:00"),
    description: "Pedido confirmado",
    status: "confirmed" as const,
  },
  {
    id: "4",
    type: "message" as const,
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pedido #{orderId}</h1>
        <p className="text-muted-foreground">
          Cliente: {order.customer}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <OrderCustomerInfo order={order} />

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

          <OrderProductList 
            products={order.products}
            onRemoveProduct={handleRemoveProduct}
          />
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
