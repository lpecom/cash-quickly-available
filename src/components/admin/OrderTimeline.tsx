import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, Clock, CheckCircle2, XCircle, Package, Truck } from "lucide-react";
import { format } from "date-fns";

interface TimelineEvent {
  id: string;
  type: "status_change" | "call" | "message";
  timestamp: Date;
  description: string;
  status?: string;
  agent?: string;
}

interface OrderTimelineProps {
  events: TimelineEvent[];
}

const getStatusIcon = (status: string) => {
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
      return <Clock className="w-4 h-4" />;
  }
};

const getEventIcon = (type: string) => {
  switch (type) {
    case "call":
      return <Phone className="w-4 h-4" />;
    case "message":
      return <MessageSquare className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export const OrderTimeline = ({ events }: OrderTimelineProps) => {
  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <div className="space-y-8">
        {events.map((event) => (
          <div key={event.id} className="relative pl-8">
            <div className="absolute left-0 top-1 h-4 w-4 rounded-full border bg-background flex items-center justify-center">
              {event.type === "status_change" && event.status
                ? getStatusIcon(event.status)
                : getEventIcon(event.type)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium leading-none">
                  {event.description}
                </p>
                {event.status && (
                  <Badge variant="outline">
                    {event.status === "pending" && "Pendente"}
                    {event.status === "confirmed" && "Confirmado"}
                    {event.status === "on_route" && "Em rota"}
                    {event.status === "delivered" && "Entregue"}
                    {event.status === "not_delivered" && "Não entregue"}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {format(event.timestamp, "dd/MM/yyyy 'às' HH:mm")}
                {event.agent && ` • ${event.agent}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};