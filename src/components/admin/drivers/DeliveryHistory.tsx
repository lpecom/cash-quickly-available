import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Delivery {
  id: string;
  orderId: string;
  date: Date;
  customer: string;
  amount: number;
  status: "completed" | "failed" | "cancelled";
  commission: number;
}

interface DeliveryHistoryProps {
  deliveries: Delivery[];
}

export function DeliveryHistory({ deliveries }: DeliveryHistoryProps) {
  const getStatusColor = (status: Delivery["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "failed":
        return "destructive";
      case "cancelled":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusText = (status: Delivery["status"]) => {
    switch (status) {
      case "completed":
        return "Concluída";
      case "failed":
        return "Falha";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Comissão</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.map((delivery) => (
            <TableRow key={delivery.id}>
              <TableCell>
                {format(delivery.date, "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>#{delivery.orderId}</TableCell>
              <TableCell>{delivery.customer}</TableCell>
              <TableCell>R$ {delivery.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(delivery.status)}>
                  {getStatusText(delivery.status)}
                </Badge>
              </TableCell>
              <TableCell>R$ {delivery.commission.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}