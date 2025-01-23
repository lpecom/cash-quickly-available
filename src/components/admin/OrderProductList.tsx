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
    <div className="rounded-md border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="text-xs font-medium text-gray-500">Produto</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Quantidade</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Preço Unitário</TableHead>
            <TableHead className="text-xs font-medium text-gray-500">Subtotal</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((item) => (
            <TableRow key={item.id} className="border-t border-gray-100">
              <TableCell className="py-4 text-sm text-gray-900">
                {item.product?.name || "Produto removido"}
              </TableCell>
              <TableCell className="text-sm text-gray-500">{item.quantity}</TableCell>
              <TableCell className="text-sm text-gray-500">
                R$ {item.price_at_time.toFixed(2)}
              </TableCell>
              <TableCell className="text-sm font-medium text-gray-900">
                R$ {(item.quantity * item.price_at_time).toFixed(2)}
              </TableCell>
              <TableCell>
                {onRemoveProduct && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveProduct(item.id)}
                    className="text-gray-400 hover:text-gray-500"
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