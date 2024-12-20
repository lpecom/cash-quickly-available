import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, MessageCircle, Package, ScrollText } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { DeliveryButtons } from "./DeliveryButtons";

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
  };
  onStartDelivery: (orderId: string) => void;
  onContactCustomer: (phone: string, orderId: string) => void;
}

export const OrderCard = ({ order, onStartDelivery, onContactCustomer }: OrderCardProps) => {
  return (
    <div
      className={`${
        order.isRecommended ? "bg-primary/10" : "bg-card"
      } rounded-lg shadow-sm p-4 space-y-3`}
    >
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
        >
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
          onClick={() => onStartDelivery(order.id)}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Iniciar Entrega
        </Button>
      ) : (
        <>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => onContactCustomer(order.phone, order.id)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Avisar Cliente
          </Button>
          <DeliveryButtons orderId={order.id} />
        </>
      )}
    </div>
  );
};