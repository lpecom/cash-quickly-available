import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, MapPin } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Order {
  id: string;
  customer_name: string;
  address: string;
  phone: string;
  status: string;
  total: number;
  delivery_instructions?: string;
}

const MotoboySales = () => {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["confirmed-orders"],
    queryFn: fetchOrders,
    refetchInterval: 5000, // Refresh every 5 seconds to get new orders
  });

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const user = await supabase.auth.getUser();
      const { error } = await supabase
        .from("orders")
        .update({ 
          status: "on_route",
          driver_id: user.data.user?.id 
        })
        .eq("id", orderId)
        .eq("status", "confirmed")
        .is("driver_id", null);

      if (error) throw error;

      toast.success("Pedido aceito com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["confirmed-orders"] });
    } catch (error) {
      console.error("Error accepting order:", error);
      toast.error("Erro ao aceitar pedido");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary p-4 flex items-center justify-center">
        <p>Carregando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary p-4 flex items-center justify-center">
        <p className="text-destructive">Erro ao carregar pedidos</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pb-6">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="container mx-auto p-4">
          <div className="mb-6">
            <h1 className="text-xl font-bold">Pedidos Disponíveis</h1>
            <p className="text-sm text-muted-foreground">
              {orders.length} pedidos aguardando entregador
            </p>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card rounded-lg shadow-sm p-4 space-y-3"
              >
                <div>
                  <h3 className="font-medium">Pedido #{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.customer_name}
                  </p>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span>{order.address}</span>
                </div>

                {order.delivery_instructions && (
                  <p className="text-sm text-muted-foreground">
                    Instruções: {order.delivery_instructions}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    R$ {order.total.toFixed(2)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAcceptOrder(order.id)}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Aceitar
                  </Button>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum pedido disponível no momento
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default MotoboySales;