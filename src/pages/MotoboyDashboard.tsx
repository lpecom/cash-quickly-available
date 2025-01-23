import { useEffect, useState } from "react";
import { Package, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderCard } from "@/components/delivery/OrderCard";
import MobileNav from "@/components/MobileNav";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type OrderWithItems = Tables<"orders"> & {
  order_items: Array<{
    quantity: number;
    price_at_time: number;
    products: {
      name: string;
    } | null;
  }>;
};

const MotoboyDashboard = () => {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["available-orders"],
    queryFn: async () => {
      console.log("Fetching available orders...");
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            quantity,
            price_at_time,
            products (
              name
            )
          )
        `)
        .eq("status", "confirmed")
        .is("driver_id", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Orders fetched:", data);
      return data as OrderWithItems[];
    },
    // Add refetch interval to keep the list updated
    refetchInterval: 5000,
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
        <p>Carregando pedidos disponíveis...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pb-16">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="container mx-auto p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Pedidos Disponíveis</h1>
            <p className="text-muted-foreground">
              {orders?.length || 0} pedidos aguardando entregador
            </p>
          </div>

          {!currentLocation && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                Ative sua localização para ver a distância até os pedidos
              </AlertDescription>
            </Alert>
          )}
          
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
                  items: `${order.order_items?.length || 0} items`,
                  phone: order.phone,
                  accepted_at: order.accepted_at,
                  created_at: order.created_at,
                  total: order.total,
                  deliveryInstructions: order.delivery_instructions || undefined,
                  products: order.order_items?.map((item) => ({
                    name: item.products?.name || 'Produto',
                    quantity: item.quantity
                  }))
                }}
                onStartDelivery={() => {}}
                onContactCustomer={() => {}}
              />
            ))}
            {orders?.length === 0 && (
              <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Nenhum pedido disponível no momento
                </p>
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
