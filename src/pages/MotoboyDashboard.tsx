import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Navigation, MessageCircle, CheckCircle, XCircle, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const DELIVERY_FAILURE_REASONS = [
  "Cliente ausente",
  "Endereço não encontrado",
  "Cliente recusou entrega",
  "Produto danificado",
  "Outros"
];

const MotoboyDashboard = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [recommendedOrder, setRecommendedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [showDeliveryButtons, setShowDeliveryButtons] = useState<{ [key: string]: boolean }>({});

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

  const contactCustomer = (phone: string, orderId: string) => {
    const whatsappUrl = `https://wa.me/${phone}`;
    window.open(whatsappUrl, '_blank');
    
    setShowDeliveryButtons(prev => ({
      ...prev,
      [orderId]: true
    }));
    
    toast({
      title: "Redirecionando para WhatsApp",
      description: "Você será redirecionado para conversar com o cliente",
    });
  };

  const handleDeliverySuccess = (orderId: string) => {
    // Here you would typically handle the file upload
    // For now, we'll just show a success message
    toast({
      title: "Upload de comprovante",
      description: "Por favor, faça o upload do comprovante de pagamento",
    });
  };

  const handleDeliveryFailure = (orderId: string) => {
    if (!selectedReason) {
      toast({
        title: "Selecione um motivo",
        description: "É necessário selecionar um motivo para a falha na entrega",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Entrega não concluída",
      description: `Motivo: ${selectedReason}`,
    });

    setSelectedReason("");
    setShowDeliveryButtons(prev => ({
      ...prev,
      [orderId]: false
    }));
  };

  const renderDeliveryButtons = (order: typeof mockOrders[0]) => {
    if (!showDeliveryButtons[order.id]) return null;

    return (
      <div className="space-y-2 mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="default">
              <CheckCircle className="w-4 h-4 mr-2" />
              Entrega Concluída
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload de Comprovante</DialogTitle>
              <DialogDescription>
                Faça o upload do comprovante de pagamento para confirmar a entrega
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button onClick={() => handleDeliverySuccess(order.id)}>
                <Upload className="w-4 h-4 mr-2" />
                Fazer Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="destructive">
              <XCircle className="w-4 h-4 mr-2" />
              Entrega Não Concluída
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Motivo da Não Entrega</DialogTitle>
              <DialogDescription>
                Selecione o motivo pelo qual a entrega não pôde ser concluída
              </DialogDescription>
            </DialogHeader>
            <Select onValueChange={setSelectedReason}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {DELIVERY_FAILURE_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason} className="bg-white hover:bg-accent">
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button onClick={() => handleDeliveryFailure(order.id)}>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
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
                <>
                  <Button
                    className="w-full mt-2"
                    variant="outline"
                    onClick={() => contactCustomer(recommendedOrder.phone, recommendedOrder.id)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Avisar Cliente
                  </Button>
                  {renderDeliveryButtons(recommendedOrder)}
                </>
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
                <>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => contactCustomer(order.phone, order.id)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Avisar Cliente
                  </Button>
                  {renderDeliveryButtons(order)}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MotoboyDashboard;