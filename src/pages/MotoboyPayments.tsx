import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";

// Mock data - replace with real API data later
const payments = [
  {
    id: "1",
    orderId: "#1234",
    amount: "R$ 15,00",
    date: "2024-02-20",
    status: "paid",
  },
  {
    id: "2",
    orderId: "#1235",
    amount: "R$ 12,00",
    date: "2024-02-20",
    status: "pending",
  },
];

const MotoboyPayments = () => {
  return (
    <div className="min-h-screen bg-secondary p-4 pb-20 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Pagamentos</h1>
            <p className="text-muted-foreground mt-1">Acompanhe seus ganhos</p>
          </div>
          <Badge variant="outline" className="px-4 py-2">
            <DollarSign className="w-4 h-4 mr-2" />
            Total: R$ 27,00
          </Badge>
        </div>

        <div className="bg-card rounded-lg shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.orderId}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={payment.status === "paid" ? "default" : "secondary"}
                    >
                      {payment.status === "paid" ? "Pago" : "Pendente"}
                    </Badge>
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

export default MotoboyPayments;