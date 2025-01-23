import { Order } from "@/types/order";
import { format } from "date-fns";
import { OrderMap } from "./OrderMap";
import { OrderTimeline } from "./OrderTimeline";
import { OrderCustomerInfo } from "./OrderCustomerInfo";
import { OrderProductList } from "./OrderProductList";
import { Button } from "../ui/button";
import { Download, Package, Clock, MapPin, User, DollarSign, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderDetailsPanelProps {
  order: Order | null;
}

export const OrderDetailsPanel = ({ order }: OrderDetailsPanelProps) => {
  if (!order) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Selecione um pedido para ver os detalhes</p>
      </div>
    );
  }

  const timelineEvents = [
    {
      id: '1',
      type: "status_change" as const,
      timestamp: new Date(order.created_at),
      description: 'Pedido criado',
      status: 'pending' as const
    },
    ...(order.accepted_at ? [{
      id: '2',
      type: "status_change" as const,
      timestamp: new Date(order.accepted_at),
      description: 'Pedido aceito pelo entregador',
      status: 'confirmed' as const
    }] : []),
    ...(order.delivery_started_at ? [{
      id: '3',
      type: "status_change" as const,
      timestamp: new Date(order.delivery_started_at),
      description: 'Entrega iniciada',
      status: 'on_route' as const
    }] : []),
    ...(order.delivery_completed_at ? [{
      id: '4',
      type: "status_change" as const,
      timestamp: new Date(order.delivery_completed_at),
      description: 'Entrega concluída',
      status: 'delivered' as const
    }] : []),
    ...(order.delivery_failure_reason ? [{
      id: '5',
      type: "status_change" as const,
      timestamp: new Date(),
      description: `Entrega falhou: ${order.delivery_failure_reason}`,
      status: 'not_delivered' as const
    }] : [])
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Pedido #{order.id.slice(0, 8)}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>{format(new Date(order.created_at), "PPP 'às' p")}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderCustomerInfo order={order} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-primary" />
                Itens do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderProductList products={order.items || []} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-primary" />
                Resumo do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Taxa de entrega</span>
                  <span>Grátis</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t font-medium">
                  <span>Total</span>
                  <span className="text-lg">R$ {order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Local de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderMap address={order.address} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Linha do Tempo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline events={timelineEvents} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};