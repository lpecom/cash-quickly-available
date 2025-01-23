import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { addDays, isBefore, isWeekend, startOfToday } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface RescheduleDeliveryDialogProps {
  orderId: string;
}

export function RescheduleDeliveryDialog({ orderId }: RescheduleDeliveryDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const today = startOfToday();
  const maxDate = addDays(today, 4); // Adding 4 days to ensure we have 2 business days

  const isDateDisabled = (date: Date) => {
    return isWeekend(date) || isBefore(date, today) || date > maxDate;
  };

  const handleReschedule = async () => {
    if (!selectedDate) {
      toast.error("Selecione uma data para reagendar");
      return;
    }

    try {
      setIsUpdating(true);
      console.log('Rescheduling delivery for order:', orderId);

      const { error } = await supabase
        .from('orders')
        .update({
          status: 'confirmed',
          delivery_started_at: null,
          delivery_completed_at: null,
          delivery_failure_reason: null,
          driver_id: null,
          accepted_at: null
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error rescheduling delivery:', error);
        throw error;
      }

      toast.success("Entrega reagendada com sucesso!");
      setIsOpen(false);
      window.location.href = '/coletas';
    } catch (error) {
      console.error('Error rescheduling delivery:', error);
      toast.error("Erro ao reagendar entrega");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Reagendar Entrega
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reagendar Entrega</DialogTitle>
          <DialogDescription>
            Selecione uma nova data para a entrega (até 2 dias úteis)
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={isDateDisabled}
            className="rounded-md border"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleReschedule} disabled={!selectedDate || isUpdating}>
            {isUpdating ? "Reagendando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}