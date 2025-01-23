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
import { Plus, Eye, Loader2 } from "lucide-react";
import { Order, orderStatusMap } from "@/types/order";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
        throw error;
      }

      return data as Order[];
    },
  });

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      // If changing to confirmed, set loading state
      if (newStatus === 'confirmed') {
        setLoadingOrderId(orderId);
      }

      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          driver_id: newStatus === 'confirmed' ? null : undefined
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        toast.error('Failed to update order status');
        setLoadingOrderId(null);
        return;
      }

      // Show different success messages based on the new status
      if (newStatus === 'confirmed') {
        toast.success('Order confirmed and available for motoboys');
      } else {
        toast.success('Order status updated successfully');
        // If changing from confirmed to another status, remove loading state
        if (loadingOrderId === orderId) {
          setLoadingOrderId(null);
        }
      }

      // Refresh orders data
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
      toast.error('An unexpected error occurred');
      setLoadingOrderId(null);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      pending: "bg-yellow-500",
      confirmed: "bg-blue-500",
      on_route: "bg-purple-500",
      delivered: "bg-green-500",
      not_delivered: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
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
                    value={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}
                    disabled={loadingOrderId === order.id}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {loadingOrderId === order.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Procurando motoboy...</span>
                            </>
                          ) : (
                            <Badge className={getStatusColor(order.status)}>
                              {orderStatusMap[order.status]}
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
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/admin/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;