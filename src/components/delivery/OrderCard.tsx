import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, MessageCircle, Package, ScrollText, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { DeliveryButtons } from "./DeliveryButtons";
import { supabase } from "@/integrations/supabase/client";

interface OrderCardProps {
  order: {
    id: string;
    customer: string;
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

export const OrderCard = ({ order, onStartDelivery, onContactCustomer }: OrderCardProps) => {
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
    <div
      className={`
        ${order.isRecommended ? "bg-primary/10" : "bg-card"}
        rounded-lg shadow-sm p-4 space-y-3 relative
        before:absolute before:inset-0 before:rounded-lg before:p-[2px]
        before:bg-gradient-to-r before:from-green-400 before:via-primary before:to-green-600
        before:content-[''] before:opacity-0 before:transition-opacity
        ${order.status === "in_progress" ? "before:opacity-100" : ""}
      `}
    >
      <div className="relative bg-background rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            {order.isRecommended && (
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Entrega Mais Próxima</h2>
              </div>
            )}
            <h3 className="font-medium">Pedido #{order.id}</h3>
            <p className="text-sm text-muted-foreground">{order.customer}</p>
          </div>
          <Badge
            variant={order.status === "in_progress" ? "default" : "secondary"}
            className={`flex items-center gap-1 ${order.status === "in_progress" ? "animate-pulse" : ""}`}
          >
            {order.status === "in_progress" && (
              <LoaderCircle className="w-3 h-3 animate-spin" />
            )}
            {order.status === "in_progress" ? "Em andamento" : "Pendente"}
          </Badge>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
          <span className="flex-1">{order.address}</span>
        </div>

        {order.products && order.products.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span>Produtos</span>
            </div>
            <ul className="text-sm space-y-1 pl-6">
              {order.products.map((product, index) => (
                <li key={index}>
                  {product.quantity}x {product.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {order.deliveryInstructions && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ScrollText className="w-4 h-4 text-muted-foreground" />
              <span>Instruções</span>
            </div>
            <p className="text-sm text-muted-foreground pl-6">{order.deliveryInstructions}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span>{order.amount}</span>
          <span>{order.items}</span>
        </div>

        {order.status === "pending" ? (
          <Button
            className="w-full"
            onClick={handleAcceptOrder}
          >
            <Navigation className="w-4 h-4 mr-2" />
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
    </div>
  );
};