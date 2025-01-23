import { OrderItem } from "@/types/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface OrderProductListProps {
  products: OrderItem[];
  onRemoveProduct?: (itemId: string) => void;
}

export const OrderProductList = ({
  products,
  onRemoveProduct,
}: OrderProductListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Preço Unitário</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.product?.name || "Produto removido"}
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                R$ {item.price_at_time.toFixed(2)}
              </TableCell>
              <TableCell>
                R$ {(item.quantity * item.price_at_time).toFixed(2)}
              </TableCell>
              <TableCell>
                {onRemoveProduct && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveProduct(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};