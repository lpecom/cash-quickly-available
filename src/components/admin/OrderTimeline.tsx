import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package, 
  Truck,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { OrderStatus, TimelineEvent } from "@/types/order";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OrderTimelineProps {
  orderId: string;
}

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "confirmed":
      return <CheckCircle2 className="w-4 h-4" />;
    case "on_route":
      return <Truck className="w-4 h-4" />;
    case "delivered":
      return <Package className="w-4 h-4" />;
    case "not_delivered":
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "confirmed":
      return "bg-blue-500";
    case "on_route":
      return "bg-purple-500";
    case "delivered":
      return "bg-green-500";
    case "not_delivered":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const OrderTimeline = ({ orderId }: OrderTimelineProps) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        return;
      }

      const timelineEvents: TimelineEvent[] = [
        {
          id: '1',
          type: "status_change",
          timestamp: new Date(order.created_at),
          description: 'Pedido criado',
          status: 'pending'
        }
      ];

      if (order.accepted_at) {
        timelineEvents.push({
          id: '2',
          type: "status_change",
          timestamp: new Date(order.accepted_at),
          description: 'Pedido aceito pelo entregador',
          status: 'confirmed'
        });
      }

      if (order.delivery_started_at) {
        timelineEvents.push({
          id: '3',
          type: "status_change",
          timestamp: new Date(order.delivery_started_at),
          description: 'Entrega iniciada',
          status: 'on_route'
        });
      }

      if (order.delivery_completed_at) {
        timelineEvents.push({
          id: '4',
          type: "status_change",
          timestamp: new Date(order.delivery_completed_at),
          description: 'Entrega concluída',
          status: 'delivered'
        });
      }

      if (order.delivery_failure_reason) {
        timelineEvents.push({
          id: '5',
          type: "status_change",
          timestamp: new Date(),
          description: `Entrega falhou: ${order.delivery_failure_reason}`,
          status: 'not_delivered'
        });
      }

      setEvents(timelineEvents);
    };

    fetchOrderHistory();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        () => {
          fetchOrderHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const sortedEvents = [...events].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="relative space-y-6">
        {sortedEvents.map((event, index) => (
          <div key={event.id} className="relative pl-8">
            {/* Timeline line */}
            {index !== sortedEvents.length - 1 && (
              <div 
                className={`absolute left-[15px] top-6 bottom-0 w-px ${
                  event.status ? getStatusColor(event.status).replace('bg-', 'bg-opacity-20 bg-') : 'bg-border'
                }`} 
              />
            )}
            
            {/* Event dot */}
            <div className={`absolute left-0 top-1 h-8 w-8 rounded-full ${
              event.status ? getStatusColor(event.status) : 'bg-gray-500'
            } flex items-center justify-center text-white shadow-lg transition-all duration-200`}>
              {event.type === "status_change" && event.status
                ? getStatusIcon(event.status)
                : <Clock className="w-4 h-4" />}
            </div>

            {/* Event content */}
            <div className="space-y-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium leading-none">
                  {event.description}
                </p>
                {event.status && (
                  <Badge variant="outline" className="capitalize">
                    {event.status.replace('_', ' ')}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {format(event.timestamp, "PPp")}
                {event.agent && ` • ${event.agent}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};