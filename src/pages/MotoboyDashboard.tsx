import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Package, Menu } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedidos em Rota</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/entregas"
                className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Entregas
              </Link>
              <Link
                to="/pagamentos"
                className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Pagamentos
              </Link>
              <Link
                to="/vendas"
                className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Vendas
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
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