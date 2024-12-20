import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Navigation, MessageCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

const mockOrders = [
  {
    id: "1",
    customer: "João Silva",
    address: "Rua Augusta, 1000, São Paulo",
    status: "pending",
    amount: "R$ 150,00",
    items: "2 items",
    distance: "1.2km",
    phone: "5511999999999" // Added phone number
  },
  {
    id: "2",
    customer: "Maria Santos",
    address: "Av. Paulista, 500, São Paulo",
    status: "pending",
    amount: "R$ 89,90",
    items: "1 item",
    distance: "0.8km",
    phone: "5511888888888" // Added phone number
  },
];

const MotoboyDashboard = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [recommendedOrder, setRecommendedOrder] = useState<typeof mockOrders[0] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position);
          const nextOrder = orders.find((order) => order.status === "pending");
          setRecommendedOrder(nextOrder || null);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Erro ao obter localização",
            description: "Por favor, ative a localização do seu dispositivo",
            variant: "destructive",
          });
        }
      );
    }
  }, [orders]);

  const startDelivery = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "in_progress" } : order
      )
    );

    toast({
      title: "Entrega iniciada!",
      description: `Pedido #${orderId}`,
    });
  };

  const contactCustomer = (phone: string) => {
    const whatsappUrl = `https://wa.me/${phone}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Redirecionando para WhatsApp",
      description: "Você será redirecionado para conversar com o cliente",
    });
  };

  return (
    <div className="min-h-screen bg-secondary p-4 pb-20">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Entregas</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie suas entregas
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <Package className="w-4 h-4 mr-1" />
            {orders.length}
          </Badge>
        </div>

        {recommendedOrder && (
          <Card className="bg-primary/10 p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Entrega Recomendada</h2>
            </div>
            <div className="space-y-2">
              <p className="font-medium">{recommendedOrder.customer}</p>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="flex-1">{recommendedOrder.address}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>{recommendedOrder.amount}</span>
                <Badge variant="secondary">{recommendedOrder.distance}</Badge>
              </div>
              {recommendedOrder.status === "pending" ? (
                <Button 
                  className="w-full mt-2"
                  onClick={() => startDelivery(recommendedOrder.id)}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Iniciar Entrega
                </Button>
              ) : (
                <Button
                  className="w-full mt-2"
                  variant="outline"
                  onClick={() => contactCustomer(recommendedOrder.phone)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Avisar Cliente
                </Button>
              )}
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-lg shadow-sm p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
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

              <div className="flex items-center justify-between text-sm">
                <span>{order.amount}</span>
                <span>{order.items}</span>
              </div>

              {order.status === "pending" ? (
                <Button
                  className="w-full"
                  onClick={() => startDelivery(order.id)}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Iniciar Entrega
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => contactCustomer(order.phone)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Avisar Cliente
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MotoboyDashboard;