import { Badge } from "@/components/ui/badge";
import { DollarSign, ChevronRight, CheckCircle2, XCircle, ArrowUp, CreditCard } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MobileNav from "@/components/MobileNav";

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  date: string;
  status: "paid" | "pending";
  delivered: boolean;
  type: "order" | "saida";
}

const MotoboyPayments = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['motoboy-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('driver_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const calculateTotalAmount = () => {
    if (!orders) return 0;
    return orders.reduce((total, order) => {
      // For delivered orders, driver gets full amount, for others half
      const adjustedAmount = order.status === 'delivered' ? order.total * 0.1 : (order.total * 0.1) / 2;
      return total + adjustedAmount;
    }, 0);
  };

  const calculateTodayGains = () => {
    if (!orders) return 0;
    const today = new Date().toISOString().split('T')[0];
    return orders
      .filter(order => order.created_at.startsWith(today))
      .reduce((total, order) => {
        const adjustedAmount = order.status === 'delivered' ? order.total * 0.1 : (order.total * 0.1) / 2;
        return total + adjustedAmount;
      }, 0);
  };

  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toFixed(2)}`;
  };

  const handleWithdrawRequest = () => {
    toast.success("Solicitação de saque enviada com sucesso!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary p-4 flex items-center justify-center">
        <p>Carregando pagamentos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pb-16">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Pagamentos</h1>
            <p className="text-sm text-muted-foreground">Seus ganhos</p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <DollarSign className="w-4 h-4 mr-1" />
            {formatCurrency(calculateTotalAmount())}
          </Badge>
        </div>

        <div className="bg-card rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-semibold">Ganhos de hoje</h2>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(calculateTodayGains())}
              </p>
            </div>
            <Button onClick={handleWithdrawRequest} variant="outline" className="gap-2">
              <ArrowUp className="w-4 h-4" />
              Solicitar saque
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-4">
            {orders?.map((order) => (
              <Link
                key={order.id}
                to={`/order/${order.id}`}
                className="block bg-card rounded-lg shadow-sm p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      Pedido #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        {order.status === 'delivered' ? (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-0 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Entregue
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Não entregue
                          </Badge>
                        )}
                      </div>
                      <span className="font-medium">
                        {formatCurrency(order.status === 'delivered' ? order.total * 0.1 : (order.total * 0.1) / 2)}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
      <MobileNav />
    </div>
  );
};

export default MotoboyPayments;