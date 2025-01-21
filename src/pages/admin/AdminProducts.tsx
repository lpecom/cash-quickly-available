import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Product } from "@/types/order";
import { useNavigate } from "react-router-dom";

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
  {
    id: "3",
    name: "Produto 3",
    price: 19.90,
    quantity: 75,
    description: "Descrição do produto 3",
  },
];

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/products/${product.id}`)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminProducts;