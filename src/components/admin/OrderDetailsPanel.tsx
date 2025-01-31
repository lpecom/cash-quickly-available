import { Order } from "@/types/order";
import { format } from "date-fns";
import { OrderMap } from "./OrderMap";
import { OrderTimeline } from "./OrderTimeline";
import { OrderCustomerInfo } from "./OrderCustomerInfo";
import { OrderProductList } from "./OrderProductList";
import { Button } from "../ui/button";
import { Download, Package, Clock, MapPin, User, DollarSign, CalendarDays, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { orderStatusMap } from "@/types/order";

interface OrderDetailsPanelProps {
  order: Order | null;
}

export const OrderDetailsPanel = ({ order }: OrderDetailsPanelProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<Order["status"]>("pending");

  useEffect(() => {
    if (order?.status) {
      setCurrentStatus(order.status);
    }
  }, [order?.status]);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Selecione um pedido para ver os detalhes</p>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: Order["status"]) => {
    try {
      setIsUpdating(true);
      console.log('Starting status update:', { 
        orderId: order.id, 
        currentStatus: currentStatus,
        newStatus: newStatus 
      });

      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating order status:', error);
        throw error;
      }

      console.log('Status update successful:', data);
      setCurrentStatus(newStatus);
      toast.success(`Status atualizado para ${orderStatusMap[newStatus]}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Erro ao atualizar status do pedido");
      setCurrentStatus(order.status);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6 bg-gray-50/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div className="flex items-center gap-4">
          <Link to="/admin/orders" className="text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Pedido #{order.id.slice(0, 8)}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <CalendarDays className="h-4 w-4" />
              <span>{format(new Date(order.created_at), "PPP 'às' p")}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={currentStatus}
            onValueChange={handleStatusChange}
            disabled={isUpdating}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue>
                <OrderStatusBadge status={currentStatus} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(orderStatusMap).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  <OrderStatusBadge status={value as Order["status"]} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-700">
                <User className="h-5 w-5 text-gray-500" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <OrderCustomerInfo order={order} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-700">
                <Package className="h-5 w-5 text-gray-500" />
                Itens do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <OrderProductList products={order.items || []} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-700">
                <DollarSign className="h-5 w-5 text-gray-500" />
                Resumo do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">R$ {order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Taxa de entrega</span>
                  <span className="font-medium text-green-600">Grátis</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-gray-900">R$ {order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-700">
                <MapPin className="h-5 w-5 text-gray-500" />
                Local de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <OrderMap address={order.address} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-700">
                <Clock className="h-5 w-5 text-gray-500" />
                Linha do Tempo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <OrderTimeline orderId={order.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};