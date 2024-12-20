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
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

// Mock data - replace with real data later
const paymentRequests = [
  {
    id: "1",
    driverName: "João Silva",
    amount: 890.5,
    requestDate: new Date(),
    status: "pending",
    pixKey: "123.456.789-00",
  },
  {
    id: "2",
    driverName: "Maria Santos",
    amount: 650.75,
    requestDate: new Date(Date.now() - 86400000),
    status: "approved",
    pixKey: "maria@email.com",
  },
];

const AdminFinance = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState(paymentRequests);

  const handleApprove = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "approved" } : req
      )
    );
    toast({
      title: "Pagamento aprovado",
      description: "O pagamento foi aprovado com sucesso.",
    });
  };

  const handleReject = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" } : req
      )
    );
    toast({
      title: "Pagamento rejeitado",
      description: "O pagamento foi rejeitado.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financeiro</h1>
        <p className="text-muted-foreground">
          Gerenciamento de solicitações de pagamento
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Motorista</TableHead>
              <TableHead>Chave PIX</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  {format(request.requestDate, "dd/MM/yyyy HH:mm")}
                </TableCell>
                <TableCell>{request.driverName}</TableCell>
                <TableCell>{request.pixKey}</TableCell>
                <TableCell>R$ {request.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      request.status === "approved"
                        ? "default"
                        : request.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {request.status === "approved"
                      ? "Aprovado"
                      : request.status === "rejected"
                      ? "Rejeitado"
                      : "Pendente"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                      >
                        Aprovar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(request.id)}
                      >
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminFinance;