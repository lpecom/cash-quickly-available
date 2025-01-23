import { Order } from "@/types/order";
import { format } from "date-fns";
import { OrderMap } from "./OrderMap";
import { OrderTimeline } from "./OrderTimeline";
import { OrderCustomerInfo } from "./OrderCustomerInfo";
import { OrderProductList } from "./OrderProductList";
import { Button } from "../ui/button";
import { Download, Package, Clock, MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderDetailsPanelProps {
  order: Order | null;
}

export const OrderDetailsPanel = ({ order }: OrderDetailsPanelProps) => {
  if (!order) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select an order to view details</p>
      </div>
    );
  }

  const timelineEvents = [
    {
      id: '1',
      type: "status_change" as const,
      timestamp: new Date(order.created_at),
      description: 'Order created',
      status: 'pending' as const
    },
    ...(order.accepted_at ? [{
      id: '2',
      type: "status_change" as const,
      timestamp: new Date(order.accepted_at),
      description: 'Order accepted by driver',
      status: 'confirmed' as const
    }] : []),
    ...(order.delivery_started_at ? [{
      id: '3',
      type: "status_change" as const,
      timestamp: new Date(order.delivery_started_at),
      description: 'Delivery started',
      status: 'on_route' as const
    }] : []),
    ...(order.delivery_completed_at ? [{
      id: '4',
      type: "status_change" as const,
      timestamp: new Date(order.delivery_completed_at),
      description: 'Delivery completed',
      status: 'delivered' as const
    }] : []),
    ...(order.delivery_failure_reason ? [{
      id: '5',
      type: "status_change" as const,
      timestamp: new Date(),
      description: `Delivery failed: ${order.delivery_failure_reason}`,
      status: 'not_delivered' as const
    }] : [])
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <Package className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h2>
              <p className="text-muted-foreground">
                Created {format(new Date(order.created_at), "PPP 'at' p")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderCustomerInfo order={order} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderProductList products={order.items || []} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderMap address={order.address} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Order Timeline
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