import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Eye, Loader2, Truck } from "lucide-react";
import { Order, orderStatusMap } from "@/types/order";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    orderId: string;
    newStatus: Order['status'];
  } | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      console.log('Fetching orders...');
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
        throw error;
      }

      console.log('Orders fetched:', data);
      return data as Order[];
    },
  });

  const handleCallDriver = async (orderId: string) => {
    try {
      setLoadingOrderId(orderId);
      console.log('Calling driver for order:', orderId);

      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'confirmed',
          driver_id: null 
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error calling driver:', error);
        toast.error(`Failed to call driver: ${error.message}`);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order is now available for drivers');
    } catch (error) {
      console.error('Error in handleCallDriver:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoadingOrderId(null);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      setLoadingOrderId(orderId);
      console.log('Updating order status:', { orderId, newStatus });

      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        toast.error(`Failed to update order status: ${error.message}`);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success(`Order status updated to ${orderStatusMap[newStatus]}`);
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
      toast.error('An unexpected error occurred while updating the order');
    } finally {
      setLoadingOrderId(null);
      setPendingStatusChange(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <Button asChild>
          <Link to="/admin/orders/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Pedido
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id} className={loadingOrderId === order.id ? "animate-pulse" : ""}>
                <TableCell>#{order.id.slice(0, 8)}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>
                  <Select 
                    defaultValue={order.status}
                    onValueChange={(value) => setPendingStatusChange({ 
                      orderId: order.id, 
                      newStatus: value as Order['status'] 
                    })}
                    disabled={loadingOrderId === order.id}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {loadingOrderId === order.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Atualizando...</span>
                            </>
                          ) : (
                            <Badge className={order.status === 'confirmed' ? 'bg-green-500' : ''}>
                              {orderStatusMap[order.status as keyof typeof orderStatusMap]}
                            </Badge>
                          )}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(orderStatusMap).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/admin/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  {order.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCallDriver(order.id)}
                      disabled={loadingOrderId === order.id}
                    >
                      {loadingOrderId === order.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Truck className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog 
        open={pendingStatusChange !== null}
        onOpenChange={(open) => !open && setPendingStatusChange(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar mudança de status</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja alterar o status do pedido para{" "}
              {pendingStatusChange && orderStatusMap[pendingStatusChange.newStatus]}?
              {pendingStatusChange?.newStatus === 'confirmed' && (
                <p className="mt-2 text-yellow-600">
                  Isso irá disponibilizar o pedido para os motoboys.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingStatusChange) {
                  handleStatusChange(pendingStatusChange.orderId, pendingStatusChange.newStatus);
                }
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminOrders;