import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderCard } from "@/components/delivery/OrderCard";
import MobileNav from "@/components/MobileNav";

type Order = Tables<"orders">;

const MotoboyDashboard = () => {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["motoboy-orders"],
    queryFn: async () => {
      console.log("Fetching orders...");
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("driver_id", (await supabase.auth.getUser()).data.user?.id)
        .eq("status", "on_route");

      if (error) throw error;
      console.log("Orders fetched:", data);
      return data as Order[];
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Não foi possível obter sua localização");
        }
      );
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pb-16">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="container mx-auto p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Pedidos em Rota</h1>
            <p className="text-muted-foreground">
              {orders?.length || 0} pedidos ativos
            </p>
          </div>
          
          <div className="space-y-4">
            {orders?.map((order) => (
              <OrderCard
                key={order.id}
                order={{
                  id: order.id,
                  customer_name: order.customer_name,
                  address: order.address,
                  status: order.status,
                  amount: `R$ ${order.total.toFixed(2)}`,
                  items: `${order.total} items`,
                  phone: order.phone,
                  accepted_at: order.accepted_at,
                  created_at: order.created_at,
                  total: order.total,
                  deliveryInstructions: order.delivery_instructions || undefined,
                }}
                onStartDelivery={() => {}}
                onContactCustomer={() => {}}
              />
            ))}
            {orders?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum pedido em rota no momento
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
      <MobileNav />
    </div>
  );
};

export default MotoboyDashboard;