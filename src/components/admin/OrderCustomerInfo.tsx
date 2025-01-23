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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-gray-500">Nome</p>
          <p className="mt-1 text-sm text-gray-900">{order.customer_name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Telefone</p>
          <p className="mt-1 text-sm text-gray-900">{order.phone}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm font-medium text-gray-500">Endereço</p>
          <p className="mt-1 text-sm text-gray-900">{order.address}</p>
        </div>
      </div>
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" size="sm" onClick={handleCall} className="w-full">
          <Phone className="mr-2 h-4 w-4" />
          Ligar
        </Button>
        <Button variant="outline" size="sm" onClick={handleMessage} className="w-full">
          <MessageSquare className="mr-2 h-4 w-4" />
          Mensagem
        </Button>
      </div>
    </div>
  );
};