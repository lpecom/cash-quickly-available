import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, MapPin } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Order {
  id: string;
  customer_name: string;
  address: string;
  phone: string;
  status: string;
  total: number;
  delivery_instructions?: string;
}

const fetchOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }

  return data as Order[];
};

const MotoboySales = () => {
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["pending-orders"],
    queryFn: fetchOrders,
  });

  const handleAddItem = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ driver_id: (await supabase.auth.getUser()).data.user?.id })
        .eq("id", orderId);

      if (error) throw error;

      toast.success("Pedido aceito com sucesso!");
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
    <div className="min-h-screen bg-secondary p-4 pb-20">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Pedidos Disponíveis</h1>
            <p className="text-sm text-muted-foreground">
              Aceite pedidos para entrega
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <Package className="w-4 h-4 mr-1" />
            {orders.length}
          </Badge>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
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
                    onClick={() => handleAddItem(order.id)}
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
        </ScrollArea>
      </div>
    </div>
  );
};

export default MotoboySales;