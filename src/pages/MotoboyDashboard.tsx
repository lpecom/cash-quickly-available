import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Package, Navigation } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type Order = Tables<"orders">;

const MotoboyDashboard = () => {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["motoboy-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("driver_id", (await supabase.auth.getUser()).data.user?.id)
        .eq("status", "on_route");

      if (error) throw error;
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
    <div className="min-h-screen bg-secondary pb-6">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="container mx-auto p-4">
          <div className="mb-6">
            <h1 className="text-xl font-bold">Pedidos em Rota</h1>
            <p className="text-sm text-muted-foreground">
              {orders?.length || 0} pedidos ativos
            </p>
          </div>
          
          <div className="space-y-4">
            {orders?.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <span className="font-semibold">Pedido #{order.id.slice(0, 8)}</span>
                  </div>
                  <Badge variant="outline">{order.status}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">Cliente: {order.customer_name}</p>
                  <p className="text-sm">Endereço: {order.address}</p>
                  <p className="text-sm">Telefone: {order.phone}</p>
                  {order.delivery_instructions && (
                    <p className="text-sm">Instruções: {order.delivery_instructions}</p>
                  )}
                </div>
                {currentLocation && (
                  <Button
                    className="mt-4 w-full"
                    asChild
                  >
                    <a
                      href={`https://www.google.com/maps/dir/${currentLocation.latitude},${currentLocation.longitude}/${encodeURIComponent(
                        order.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      Navegar até o endereço
                    </a>
                  </Button>
                )}
              </div>
            ))}
            {orders?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum pedido em rota no momento
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default MotoboyDashboard;