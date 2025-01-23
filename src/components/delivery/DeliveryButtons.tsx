import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Upload, Timer, Navigation, MessageCircle } from "lucide-react";
import { toast } from "sonner";
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
import { supabase } from "@/integrations/supabase/client";

const DELIVERY_FAILURE_REASONS = [
  "Cliente ausente",
  "Endereço não encontrado",
  "Cliente recusou entrega",
  "Produto danificado",
  "Outros"
];

interface DeliveryButtonsProps {
  orderId: string;
  phone: string;
  address: string;
  acceptedAt?: string | null;
}

export const DeliveryButtons = ({ orderId, phone, address, acceptedAt }: DeliveryButtonsProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (acceptedAt) {
      const interval = setInterval(() => {
        const start = new Date(acceptedAt).getTime();
        const now = new Date().getTime();
        const diff = now - start;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [acceptedAt]);

  const handleDeliverySuccess = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'delivered',
          delivery_completed_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      toast.success("Entrega confirmada com sucesso!");
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error("Erro ao confirmar entrega");
    }
  };

  const handleDeliveryFailure = async () => {
    if (!selectedReason) {
      toast.error("Selecione um motivo para a falha na entrega");
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'not_delivered',
          delivery_completed_at: new Date().toISOString(),
          delivery_failure_reason: selectedReason
        })
        .eq('id', orderId);

      if (error) throw error;
      toast.success("Status atualizado com sucesso");
      setSelectedReason("");
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error("Erro ao atualizar status");
    }
  };

  const handleContactCustomer = () => {
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleOpenMaps = () => {
    // Offer both Google Maps and Waze options
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    const wazeUrl = `https://waze.com/ul?q=${encodedAddress}`;
    
    // Open a dialog to let the user choose
    setShowConfirmDialog(true);
  };

  return (
    <div className="space-y-4 mt-4">
      {acceptedAt && (
        <div className="flex items-center justify-center gap-2 text-lg font-semibold">
          <Timer className="w-5 h-5" />
          <span>{elapsedTime}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={handleContactCustomer} variant="outline">
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
        <Button onClick={handleOpenMaps} variant="outline">
          <Navigation className="w-4 h-4 mr-2" />
          Navegação
        </Button>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full" variant="default">
            <CheckCircle className="w-4 h-4 mr-2" />
            Entrega Concluída
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Entrega</DialogTitle>
            <DialogDescription>
              Confirme que o pedido foi entregue com sucesso
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleDeliverySuccess()}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full" variant="destructive">
            <XCircle className="w-4 h-4 mr-2" />
            Não Foi Possível Entregar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motivo da Não Entrega</DialogTitle>
            <DialogDescription>
              Selecione o motivo pelo qual a entrega não pôde ser concluída
            </DialogDescription>
          </DialogHeader>
          <Select onValueChange={setSelectedReason}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um motivo" />
            </SelectTrigger>
            <SelectContent>
              {DELIVERY_FAILURE_REASONS.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={() => handleDeliveryFailure()}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolha o App de Navegação</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => {
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
                setShowConfirmDialog(false);
              }}
            >
              Google Maps
            </Button>
            <Button
              onClick={() => {
                window.open(`https://waze.com/ul?q=${encodeURIComponent(address)}`, '_blank');
                setShowConfirmDialog(false);
              }}
            >
              Waze
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};