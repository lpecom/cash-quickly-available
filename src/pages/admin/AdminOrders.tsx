import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/order";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { OrderDetailsPanel } from "@/components/admin/OrderDetailsPanel";

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
        throw error;
      }

      console.log('Orders fetched:', data);
      return data as Order[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="animate-pulse text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-6rem)]">
      <div className="w-1/3 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">All Orders</h1>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <div className="space-y-4 overflow-auto pr-4" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
          {orders?.map((order) => (
            <div
              key={order.id}
              className={`bg-card rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedOrder?.id === order.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Order #{order.id.slice(0, 8)}</h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(order.id);
                      }}
                      className="text-primary hover:text-primary/80"
                    >
                      📋
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), "h:mma")} · Today
                  </p>
                </div>
                <OrderStatusBadge status={order.status as Order['status']} />
              </div>

              <div className="space-y-2">
                <p className="font-medium">{order.customer_name}</p>
                <p className="text-sm text-muted-foreground truncate">{order.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-card rounded-lg p-6">
        <OrderDetailsPanel order={selectedOrder} />
      </div>
    </div>
  );
};

export default AdminOrders;