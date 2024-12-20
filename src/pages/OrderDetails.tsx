import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Package, MapPin, Navigation, DollarSign } from "lucide-react";
import { useParams } from "react-router-dom";

// This would typically come from an API
const getMockOrder = (id: string) => ({
  id,
  customer: "João Silva",
  address: "Rua Augusta, 1000, São Paulo",
  status: "pending",
  amount: "R$ 150,00",
  items: "2 items",
  distance: "1.2km",
  phone: "5511999999999",
  paymentStatus: "paid",
  createdAt: "2024-02-20 14:30",
  deliveryNotes: "Entregar na portaria",
});

const OrderDetails = () => {
  const { orderId } = useParams();
  const order = getMockOrder(orderId || "");

  return (
    <div className="min-h-screen bg-secondary p-4 pb-20">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Pedido #{order.id}</h1>
          <p className="text-sm text-muted-foreground">
            Criado em {order.createdAt}
          </p>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="font-semibold mb-3">Informações do Cliente</h2>
            <div className="space-y-2">
              <p className="text-sm">{order.customer}</p>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="flex-1">{order.address}</span>
              </div>
              {order.deliveryNotes && (
                <p className="text-sm text-muted-foreground">
                  Obs: {order.deliveryNotes}
                </p>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold mb-3">Detalhes da Entrega</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{order.items}</span>
                </div>
                <Badge variant={order.status === "pending" ? "secondary" : "default"}>
                  {order.status === "pending" ? "Pendente" : "Em andamento"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{order.distance}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold mb-3">Pagamento</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span>{order.amount}</span>
              </div>
              <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                {order.paymentStatus === "paid" ? "Pago" : "Pendente"}
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;