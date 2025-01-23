import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Navigation, DollarSign, Clock } from "lucide-react";
import { toast } from "sonner";
import { DeliveryButtons } from "./DeliveryButtons";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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
    created_at: string;
    total: number;
  };
  onStartDelivery: (orderId: string) => void;
  onContactCustomer: (phone: string, orderId: string) => void;
}

export const OrderCard = ({ order, onStartDelivery }: OrderCardProps) => {
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAcceptOrder = async () => {
    try {
      setIsAccepting(true);
      console.log('Accepting order:', order.id);

      const { error } = await supabase
        .from('orders')
        .update({
          status: 'on_route',
          driver_id: (await supabase.auth.getUser()).data.user?.id,
          accepted_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (error) {
        console.error('Error accepting order:', error);
        throw error;
      }

      onStartDelivery(order.id);
      toast.success("Pedido aceito com sucesso!");
      window.location.href = '/entregas';
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error("Erro ao aceitar pedido");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleOpenMaps = () => {
    const encodedAddress = encodeURIComponent(order.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  // Calculate commission (10% of order total)
  const commission = (order.total * 0.10).toFixed(2);

  return (
    <div className="bg-card rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Pedido #{order.id.slice(0, 8)}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(order.created_at), {
                addSuffix: true,
                locale: ptBR
              })}
            </p>
          </div>
        </div>
        <Badge variant={order.status === "on_route" ? "default" : "secondary"}>
          {order.status === "on_route" ? "Em rota" : "Disponível"}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">{order.customer_name}</p>
            <p className="text-sm text-muted-foreground">{order.address}</p>
            {order.deliveryInstructions && (
              <p className="text-sm text-muted-foreground mt-1 italic">
                Obs: {order.deliveryInstructions}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              Comissão: R$ {commission}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Entrega imediata
            </span>
          </div>
        </div>
      </div>

      {order.status === "pending" ? (
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={handleOpenMaps}
            className="w-full"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Ver no mapa
          </Button>
          <Button
            className="w-full"
            onClick={handleAcceptOrder}
            disabled={isAccepting}
          >
            {isAccepting ? (
              "Aceitando..."
            ) : (
              <>
                <Package className="w-4 h-4 mr-2" />
                Aceitar entrega
              </>
            )}
          </Button>
        </div>
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