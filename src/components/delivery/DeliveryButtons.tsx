import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Upload, Timer, Navigation, MessageCircle, RotateCcw } from "lucide-react";
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
  status: string;
}

export const DeliveryButtons = ({ orderId, phone, address, acceptedAt, status }: DeliveryButtonsProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDeliverySuccess = async () => {
    try {
      setIsUpdating(true);
      console.log('Updating order status to delivered:', orderId);

      const { error } = await supabase
        .from('orders')
        .update({
          status: 'delivered',
          delivery_completed_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order:', error);
        throw error;
      }

      toast.success("Entrega confirmada com sucesso!");
      window.location.href = '/entregas';
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error("Erro ao confirmar entrega");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeliveryFailure = async () => {
    if (!selectedReason) {
      toast.error("Selecione um motivo para a falha na entrega");
      return;
    }

    try {
      setIsUpdating(true);
      console.log('Updating order status to not delivered:', orderId);

      const { error } = await supabase
        .from('orders')
        .update({
          status: 'not_delivered',
          delivery_completed_at: new Date().toISOString(),
          delivery_failure_reason: selectedReason
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order:', error);
        throw error;
      }

      toast.success("Status atualizado com sucesso");
      setSelectedReason("");
      window.location.href = '/entregas';
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error("Erro ao atualizar status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReturnConfirmation = async () => {
    try {
      setIsUpdating(true);
      console.log('Confirming return for order:', orderId);

      const { error } = await supabase
        .from('orders')
        .update({
          status: 'returned',
          delivery_completed_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error confirming return:', error);
        throw error;
      }

      toast.success("Devolução confirmada com sucesso!");
      window.location.href = '/coletas';
    } catch (error) {
      console.error('Error confirming return:', error);
      toast.error("Erro ao confirmar devolução");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleContactCustomer = () => {
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleOpenMaps = () => {
    const encodedAddress = encodeURIComponent(address);
    setShowConfirmDialog(true);
  };

  // If the order is in "not_delivered" status, show only the return confirmation button
  if (status === 'not_delivered') {
    return (
      <div className="space-y-4 mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="default">
              <RotateCcw className="w-4 h-4 mr-2" />
              Confirmar Devolução
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Devolução</DialogTitle>
              <DialogDescription>
                Confirme que o pedido foi devolvido ao estabelecimento
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleReturnConfirmation} disabled={isUpdating}>
                {isUpdating ? 'Atualizando...' : 'Confirmar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Regular delivery buttons for other statuses
  return (
    <div className="space-y-4 mt-4">
      {acceptedAt && (
        <div className="flex items-center justify-center gap-2 text-lg font-semibold">
          <Timer className="w-5 h-5" />
          <span>{elapsedTime}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={handleContactCustomer} variant="outline" disabled={isUpdating}>
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
        <Button onClick={handleOpenMaps} variant="outline" disabled={isUpdating}>
          <Navigation className="w-4 h-4 mr-2" />
          Navegação
        </Button>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full" variant="default" disabled={isUpdating}>
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
            <Button variant="outline" onClick={handleDeliverySuccess} disabled={isUpdating}>
              {isUpdating ? 'Atualizando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full" variant="destructive" disabled={isUpdating}>
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
            <Button onClick={handleDeliveryFailure} disabled={isUpdating}>
              {isUpdating ? 'Atualizando...' : 'Confirmar'}
            </Button>
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