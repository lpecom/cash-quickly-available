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
import { Plus, Trash2 } from "lucide-react";
import { Order, orderStatusMap, Product } from "@/types/order";

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
    // Implement add product logic
    console.log("Adding product:", selectedProduct, "quantity:", quantity);
  };

  const handleRemoveProduct = (productId: string) => {
    // Implement remove product logic
    console.log("Removing product:", productId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pedido #{orderId}</h1>
        <Badge className="text-lg">{orderStatusMap[order.status]}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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