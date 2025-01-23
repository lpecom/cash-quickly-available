import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Navigation, DollarSign, Clock, Phone, CheckCircle2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [isAccepting, setIsAccepting] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleAcceptOrder = async () => {
    try {
      setIsAccepting(true);
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'on_route',
          driver_id: (await supabase.auth.getUser()).data.user?.id,
          accepted_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
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
    if (!order) return;
    const encodedAddress = encodeURIComponent(order.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleCall = () => {
    if (!order) return;
    window.open(`tel:${order.phone}`, '_blank');
  };

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-secondary p-4 flex items-center justify-center">
        <p>Carregando detalhes do pedido...</p>
      </div>
    );
  }

  // Calculate commission (10% of order total)
  const commission = (order.total * 0.10).toFixed(2);

  return (
    <div className="min-h-screen bg-secondary p-4 pb-20">
      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Pedido #{order.id.slice(0, 8)}</h1>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(order.created_at), {
                addSuffix: true,
                locale: ptBR
              })}
            </p>
          </div>
          <Badge variant={order.status === "pending" ? "secondary" : "default"}>
            {order.status === "pending" ? "Disponível" : "Em andamento"}
          </Badge>
        </div>

        <Card className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Informações do Cliente</h3>
              <div className="mt-2 space-y-2">
                <p className="text-sm font-medium">{order.customer_name}</p>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <span className="text-sm flex-1">{order.address}</span>
                </div>
                {order.delivery_instructions && (
                  <p className="text-sm text-muted-foreground italic">
                    Obs: {order.delivery_instructions}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
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
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleOpenMaps}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Ver no mapa
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleCall}
          >
            <Phone className="w-4 h-4 mr-2" />
            Ligar para cliente
          </Button>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleAcceptOrder}
          disabled={isAccepting}
        >
          {isAccepting ? (
            "Aceitando..."
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Aceitar entrega
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OrderDetails;