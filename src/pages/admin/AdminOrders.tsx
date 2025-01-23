import { OrdersMenu } from "@/components/admin/orders/OrdersMenu";
import { OrderFilters } from "@/components/admin/orders/OrderFilters";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useState } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { DateRange } from "react-day-picker";
import { Order } from "@/types/order";

const AdminOrders = () => {
  const [filters, setFilters] = useState<{
    dateRange?: DateRange;
    status?: Order["status"] | "all";
    search?: string;
  }>({});

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            id,
            order_id,
            product_id,
            quantity,
            price_at_time,
            created_at,
            product:products(
              id,
              name,
              price,
              description,
              active,
              created_at,
              updated_at,
              sku,
              variations,
              stock
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (filters.dateRange?.from && filters.dateRange?.to) {
        query = query
          .gte('created_at', filters.dateRange.from.toISOString())
          .lte('created_at', filters.dateRange.to.toISOString());
      }

      if (filters.status && filters.status !== 'all') {
        const statusGroups = {
          active: ['pending', 'confirmed', 'on_route'],
          completed: ['delivered'],
          rescheduled: ['not_delivered']
        };

        const selectedGroup = Object.entries(statusGroups).find(([_, statuses]) => 
          statuses.includes(filters.status as string)
        );

        if (selectedGroup) {
          query = query.in('status', selectedGroup[1]);
        } else {
          query = query.eq('status', filters.status);
        }
      }

      if (filters.search) {
        query = query.or(`customer_name.ilike.%${filters.search}%,id.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      return (data || []).map(order => ({
        ...order,
        status: order.status as Order["status"]
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div>Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pedidos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        <Package className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Pedidos</h1>
      </div>

      <OrdersMenu />
      
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {orders?.length || 0} pedidos encontrados
        </p>
        <Link to="/admin/orders/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Pedido
          </Button>
        </Link>
      </div>

      <OrderFilters onFiltersChange={setFilters} />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.id.slice(0, 8)}
                </TableCell>
                <TableCell>
                  {format(new Date(order.created_at), "MMM d, yyyy h:mm a")}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-sm text-muted-foreground">{order.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                <TableCell>
                  {order.items?.map((item) => (
                    <div key={item.id} className="text-sm">
                      {item.quantity}x {item.product.name}
                    </div>
                  ))}
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/admin/orders/${order.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
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