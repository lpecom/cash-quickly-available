import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowRight, Clock } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const MotoboyPayments = () => {
  const [isRequesting, setIsRequesting] = useState(false);

  const { data: metrics } = useQuery({
    queryKey: ["driver-metrics"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not found");

      const { data, error } = await supabase.rpc('get_driver_metrics', {
        driver_uuid: user.user.id
      });

      if (error) throw error;
      return data[0];
    }
  });

  const { data: deliveredOrders } = useQuery({
    queryKey: ["delivered-orders"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq('driver_id', user.user?.id)
        .eq('status', 'delivered')
        .order('delivery_completed_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleRequestPayment = async () => {
    setIsRequesting(true);
    // TODO: Implement payment request logic
    setTimeout(() => setIsRequesting(false), 1000);
  };

  return (
    <div className="min-h-screen bg-secondary pb-16">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="container mx-auto p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Pagamentos</h1>
            <p className="text-muted-foreground">
              Gerencie seus ganhos e pagamentos
            </p>
          </div>

          <div className="grid gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Resumo</h2>
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total de entregas</span>
                  <span className="font-medium">{metrics?.total_deliveries || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Taxa de sucesso</span>
                  <span className="font-medium">{metrics?.success_rate || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Ganhos totais</span>
                  <span className="font-medium">R$ {metrics?.total_earnings?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={handleRequestPayment}
                disabled={isRequesting}
              >
                {isRequesting ? (
                  "Solicitando..."
                ) : (
                  <>
                    Solicitar pagamento
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </Card>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Histórico de entregas</h2>
              {deliveredOrders?.map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">Pedido #{order.id.slice(0, 8)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.customer_name}
                      </p>
                    </div>
                    <span className="text-lg font-medium">
                      R$ {order.commission?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      {format(new Date(order.delivery_completed_at || ''), "dd MMM yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      <MobileNav />
    </div>
  );
};

export default MotoboyPayments;