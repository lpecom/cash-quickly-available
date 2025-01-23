import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus } from "lucide-react";
import { Order, orderStatusMap } from "@/types/order";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { OrderActions } from "@/components/admin/OrderActions";

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
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'confirmed',
          driver_id: null 
        })
        .eq('id', orderId);

      if (error) {
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
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
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
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-pulse text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/orders/new">
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow 
                key={order.id} 
                className={`${
                  loadingOrderId === order.id ? "animate-pulse" : ""
                }`}
              >
                <TableCell className="font-medium">
                  #{order.id.slice(0, 8)}
                </TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                  {order.address}
                </TableCell>
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
                        <OrderStatusBadge status={order.status as Order['status']} />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(orderStatusMap).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          <OrderStatusBadge status={value as Order['status']} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  R$ {order.total.toFixed(2)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <OrderActions
                    orderId={order.id}
                    status={order.status}
                    onCallDriver={handleCallDriver}
                    isLoading={loadingOrderId === order.id}
                  />
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
            <AlertDialogTitle>Confirm status change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the order status to{" "}
              {pendingStatusChange && orderStatusMap[pendingStatusChange.newStatus]}?
              {pendingStatusChange?.newStatus === 'confirmed' && (
                <p className="mt-2 text-yellow-600">
                  This will make the order available for drivers.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingStatusChange) {
                  handleStatusChange(
                    pendingStatusChange.orderId,
                    pendingStatusChange.newStatus
                  );
                }
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminOrders;