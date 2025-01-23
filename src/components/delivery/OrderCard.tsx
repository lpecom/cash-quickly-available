import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { DeliveryButtons } from "./DeliveryButtons";
import { supabase } from "@/integrations/supabase/client";

interface OrderCardProps {
  order: {
    id: string;
    customer_name: string;
    address: string;
    status: string;
    amount: string;
    items: string;
    phone: string;
    isRecommended?: boolean;
    products?: Array<{ name: string; quantity: number }>;
    deliveryInstructions?: string;
    accepted_at?: string | null;
  };
  onStartDelivery: (orderId: string) => void;
  onContactCustomer: (phone: string, orderId: string) => void;
}

export const OrderCard = ({ order, onStartDelivery }: OrderCardProps) => {
  const handleAcceptOrder = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'on_route',
          driver_id: (await supabase.auth.getUser()).data.user?.id,
          accepted_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (error) throw error;
      onStartDelivery(order.id);
      toast.success("Pedido aceito com sucesso!");
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error("Erro ao aceitar pedido");
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6" />
          <div>
            <h3 className="font-medium">Pedido #{order.id.slice(0, 8)}</h3>
            <p className="text-muted-foreground">Cliente: {order.customer_name}</p>
          </div>
        </div>
        <Badge variant={order.status === "on_route" ? "default" : "secondary"}>
          {order.status === "on_route" ? "Em rota" : "Pendente"}
        </Badge>
      </div>

      <div className="space-y-2">
        <p className="text-sm">
          <span className="font-medium">Endereço:</span> {order.address}
        </p>
        <p className="text-sm">
          <span className="font-medium">Telefone:</span> {order.phone}
        </p>
      </div>

      {order.status === "pending" ? (
        <Button
          className="w-full"
          onClick={handleAcceptOrder}
        >
          Iniciar Entrega
        </Button>
      ) : (
        <DeliveryButtons 
          orderId={order.id}
          phone={order.phone}
          address={order.address}
          acceptedAt={order.accepted_at}
        />
      )}
    </div>
  );
};