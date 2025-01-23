import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, ChevronDown, Copy, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DashboardOrderListProps {
  orders: Array<{
    id: string;
    customer_name: string;
    address: string;
    phone: string;
    status: string;
    created_at: string;
    items?: Array<{
      product?: {
        name: string;
      };
      quantity: number;
    }>;
  }>;
  selectedOrderId?: string | null;
  onOrderSelect?: (orderId: string) => void;
}

export function DashboardOrderList({ orders, selectedOrderId, onOrderSelect }: DashboardOrderListProps) {
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID copiado!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "on_route":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "not_delivered":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Aguardando";
      case "confirmed":
        return "Confirmado";
      case "on_route":
        return "Em rota";
      case "delivered":
        return "Entregue";
      case "not_delivered":
        return "Não entregue";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pedidos Recentes</h2>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card 
            key={order.id} 
            className={cn(
              "p-4 hover:shadow-md transition-shadow cursor-pointer",
              selectedOrderId === order.id && "ring-2 ring-primary"
            )}
            onClick={() => onOrderSelect?.(order.id)}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      Pedido #{order.id.slice(0, 8)}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyId(order.id);
                      }}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {format(new Date(order.created_at), "HH:mm", {
                        locale: ptBR,
                      })}
                    </span>
                    <span>•</span>
                    <span>
                      {format(new Date(order.created_at), "dd MMM yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="font-medium">{order.customer_name}</h4>
                <div className="grid gap-2">
                  {order.items?.map((item, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {item.quantity}x {item.product?.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate max-w-[300px]">{order.address}</span>
                </div>
                <Link
                  to={`tel:${order.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <Phone className="w-4 h-4" />
                  <span>{order.phone}</span>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}