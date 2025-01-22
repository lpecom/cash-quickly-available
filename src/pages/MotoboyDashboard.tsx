import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { OrderCard } from "@/components/delivery/OrderCard";
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

const MotoboyDashboard = () => {
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);

  // Fetch orders assigned to the current motoboy
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['motoboy-assigned-orders'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('driver_id', user.user.id)
        .in('status', ['pending', 'in_progress'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }

      return data as Order[];
    }
  });

  // Get current location for navigation
  useState(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Por favor, ative a localização do seu dispositivo");
        }
      );
    }
  }, []);

  const startDelivery = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'in_progress' })
        .eq('id', orderId);

      if (error) throw error;

      toast.success("Entrega iniciada!");
    } catch (error) {
      console.error("Error starting delivery:", error);
      toast.error("Erro ao iniciar entrega");
    }
  };

  const contactCustomer = (phone: string) => {
    const whatsappUrl = `https://wa.me/${phone}`;
    window.open(whatsappUrl, '_blank');
    toast("Redirecionando para WhatsApp");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary p-4 flex items-center justify-center">
        <p>Carregando entregas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary p-4 pb-20">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Entregas</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie suas entregas
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <Package className="w-4 h-4 mr-1" />
            {orders.length}
          </Badge>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={{
                ...order,
                isRecommended: false
              }}
              onStartDelivery={startDelivery}
              onContactCustomer={contactCustomer}
            />
          ))}

          {orders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma entrega pendente no momento
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MotoboyDashboard;