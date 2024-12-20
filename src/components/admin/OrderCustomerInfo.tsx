import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface OrderCustomerInfoProps {
  order: Order;
}

export const OrderCustomerInfo = ({ order }: OrderCustomerInfoProps) => {
  const handleCall = () => {
    window.location.href = `tel:${order.phone}`;
    toast.success("Iniciando chamada...");
  };

  const handleMessage = () => {
    window.open(`https://wa.me/55${order.phone}`, '_blank');
    toast.success("Abrindo WhatsApp...");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Informações do Cliente</h2>
      <div>
        <p className="font-medium">Nome</p>
        <p>{order.customer}</p>
      </div>
      <div>
        <p className="font-medium">Endereço</p>
        <p>{order.address}</p>
      </div>
      <div>
        <p className="font-medium">Telefone</p>
        <p>{order.phone}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleCall}>
          <Phone className="mr-2 h-4 w-4" />
          Ligar
        </Button>
        <Button variant="outline" onClick={handleMessage}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Mensagem
        </Button>
      </div>
    </div>
  );
};