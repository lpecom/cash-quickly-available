import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
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

const DELIVERY_FAILURE_REASONS = [
  "Cliente ausente",
  "Endereço não encontrado",
  "Cliente recusou entrega",
  "Produto danificado",
  "Outros"
];

interface DeliveryButtonsProps {
  orderId: string;
}

export const DeliveryButtons = ({ orderId }: DeliveryButtonsProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");

  const handleDeliverySuccess = () => {
    toast({
      title: "Upload de comprovante",
      description: "Por favor, faça o upload do comprovante de pagamento",
    });
  };

  const handleDeliveryFailure = () => {
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
  };

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
            <Button onClick={() => handleDeliverySuccess()}>
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
            <Button onClick={() => handleDeliveryFailure()}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};