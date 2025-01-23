import { Badge } from "@/components/ui/badge";
import { DollarSign, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@/types/order";
import MobileNav from "@/components/MobileNav";

const fetchOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "confirmed")
    .is("driver_id", null);

  if (error) throw error;
  return data || [];
};

const MotoboySales = () => {
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["confirmed-orders"],
    queryFn: fetchOrders,
    refetchInterval: 5000, // Refresh every 5 seconds to get new orders
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary p-4 flex items-center justify-center">
        <p>Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pb-16">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6 p-4">
          <div>
            <h1 className="text-xl font-bold">Pedidos Disponíveis</h1>
            <p className="text-sm text-muted-foreground">
              {orders.length} pedidos para entrega
            </p>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-4 px-4">
            {orders.map((order) => (
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
                        {order.status === "delivered" ? (
                          <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary border-0 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Entregue
                          </Badge>
                        ) : (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            Não entregue
                          </Badge>
                        )}
                      </div>
                      <span className="font-medium">
                        R$ {order.total.toFixed(2)}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum pedido disponível no momento
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <MobileNav />
    </div>
  );
};

export default MotoboySales;