import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderFilters } from "@/components/admin/orders/OrderFilters";
import { OrdersMenu } from "@/components/admin/orders/OrdersMenu";
import { Package, ArrowUpDown, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { OrderStatus } from "@/types/order";

// Temporary mock data
const mockOrders = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    customer_name: "João Silva",
    total: 159.90,
    status: "pending" as OrderStatus,
    items: [
      {
        product: {
          name: "Camiseta Básica",
          shopify_id: "gid://shopify/Product/123456789"
        },
        quantity: 2
      }
    ]
  },
  {
    id: "2",
    created_at: new Date().toISOString(),
    customer_name: "Maria Santos",
    total: 299.90,
    status: "confirmed" as OrderStatus,
    items: [
      {
        product: {
          name: "Calça Jeans",
          shopify_id: "gid://shopify/Product/987654321"
        },
        quantity: 1
      }
    ]
  }
];

const getStatusColor = (status: OrderStatus) => {
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

const getStatusText = (status: OrderStatus) => {
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

export default function SellerOrders() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");

  const handleFiltersChange = (filters: {
    dateRange?: DateRange;
    status?: OrderStatus | "all";
    search?: string;
  }) => {
    if (filters.dateRange !== undefined) setDateRange(filters.dateRange);
    if (filters.status !== undefined) setSelectedStatus(filters.status);
    if (filters.search !== undefined) setSearch(filters.search);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
          <p className="text-muted-foreground">
            Gerencie seus pedidos e acompanhe o status das entregas
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Package className="w-4 h-4 mr-2" />
            Novo Pedido
          </Button>
        </div>
      </div>

      <OrdersMenu />
      <OrderFilters onFiltersChange={handleFiltersChange} />

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      Pedido #{order.id}
                    </h3>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    R$ {order.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer_name}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-muted-foreground">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-1">
                      <span>
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        SKU: {item.product.shopify_id.split('/').pop()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Atualizar Status
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}