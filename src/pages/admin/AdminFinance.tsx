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
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PaymentRequest {
  id: string;
  driverName: string;
  amount: number;
  requestDate: string;
  status: string;
  pixKey?: string;
  driverId: string;
}

const AdminFinance = () => {
  const { toast } = useToast();
  
  const { data: paymentRequests, isLoading, refetch } = useQuery({
    queryKey: ['payment-requests'],
    queryFn: async () => {
      // Fetch orders with driver information
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id,
          total,
          created_at,
          status,
          driver_id,
          driver:profiles!orders_driver_id_fkey (
            full_name,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return orders.map(order => ({
        id: order.id,
        driverName: order.driver?.full_name || 'Unknown Driver',
        amount: order.total * 0.1, // 10% commission
        requestDate: order.created_at,
        status: order.status,
        pixKey: order.driver?.phone, // Using phone as PIX key for now
        driverId: order.driver_id
      }));
    }
  });

  const handleApprove = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Pagamento aprovado",
        description: "O pagamento foi aprovado com sucesso.",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o pagamento.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Pagamento rejeitado",
        description: "O pagamento foi rejeitado.",
        variant: "destructive",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar o pagamento.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando pagamentos...</p>
      </div>
    );
  }

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
            {paymentRequests?.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  {format(new Date(request.requestDate), "dd/MM/yyyy HH:mm")}
                </TableCell>
                <TableCell>{request.driverName}</TableCell>
                <TableCell>{request.pixKey || 'Não informado'}</TableCell>
                <TableCell>R$ {request.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      request.status === "paid"
                        ? "default"
                        : request.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {request.status === "paid"
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