import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";

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

  // Get current location for navigation
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
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Pedidos em Rota</h1>
      <div className="grid gap-4">
        {orders?.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span className="font-semibold">Pedido #{order.id}</span>
              </div>
              <Badge>{order.status}</Badge>
            </div>
            <div className="space-y-2">
              <p>Cliente: {order.customer_name}</p>
              <p>Endereço: {order.address}</p>
              <p>Telefone: {order.phone}</p>
              {order.delivery_instructions && (
                <p>Instruções: {order.delivery_instructions}</p>
              )}
            </div>
            {currentLocation && (
              <a
                href={`https://www.google.com/maps/dir/${currentLocation.latitude},${currentLocation.longitude}/${encodeURIComponent(
                  order.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded bg-primary px-4 py-2 text-center text-primary-foreground hover:bg-primary/90"
              >
                Navegar até o endereço
              </a>
            )}
          </div>
        ))}
        {orders?.length === 0 && (
          <p className="text-center text-muted-foreground">
            Nenhum pedido em rota no momento
          </p>
        )}
      </div>
    </div>
  );
};

export default MotoboyDashboard;