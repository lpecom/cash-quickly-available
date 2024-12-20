import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { OrderCard } from "@/components/delivery/OrderCard";

const mockOrders = [
  {
    id: "1",
    customer: "João Silva",
    address: "Rua Augusta, 1000, São Paulo",
    status: "pending",
    amount: "R$ 150,00",
    items: "2 items",
    distance: "1.2km",
    phone: "5511999999999",
    products: [
      { name: "X-Burger", quantity: 1 },
      { name: "Batata Frita", quantity: 1 }
    ],
    deliveryInstructions: "Entregar na portaria. Não tem interfone."
  },
  {
    id: "2",
    customer: "Maria Santos",
    address: "Av. Paulista, 500, São Paulo",
    status: "pending",
    amount: "R$ 89,90",
    items: "1 item",
    distance: "0.8km",
    phone: "5511888888888",
    products: [
      { name: "Pizza Grande Margherita", quantity: 1 }
    ],
    deliveryInstructions: "Apartamento 42, Bloco B"
  },
];

const MotoboyDashboard = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [recommendedOrderId, setRecommendedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position);
          const nextOrder = orders.find((order) => order.status === "pending");
          if (nextOrder) {
            setRecommendedOrderId(nextOrder.id);
          }
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

  const contactCustomer = (phone: string, orderId: string) => {
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

        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={{
                ...order,
                isRecommended: order.id === recommendedOrderId
              }}
              onStartDelivery={startDelivery}
              onContactCustomer={contactCustomer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MotoboyDashboard;