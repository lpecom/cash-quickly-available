import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { DriverMetrics } from "@/components/admin/drivers/DriverMetrics";
import { DeliveryHistory } from "@/components/admin/drivers/DeliveryHistory";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { DriversMenu } from "@/components/admin/drivers/DriversMenu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const mapOrderStatusToDeliveryStatus = (
  orderStatus: string
): "completed" | "failed" | "cancelled" => {
  switch (orderStatus) {
    case "delivered":
      return "completed";
    case "not_delivered":
      return "failed";
    default:
      return "cancelled";
  }
};

const AdminDrivers = () => {
  const { data: drivers, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'motoboy');

      if (error) throw error;
      return profiles;
    }
  });

  const { data: driverMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['driver-metrics', drivers?.[0]?.id],
    enabled: !!drivers?.[0]?.id,
    queryFn: async () => {
      if (!drivers?.[0]?.id) return null;
      
      const { data, error } = await supabase
        .rpc('get_driver_metrics', {
          driver_uuid: drivers[0].id
        });

      if (error) throw error;
      return data[0];
    }
  });

  const { data: deliveries, isLoading: isLoadingDeliveries } = useQuery({
    queryKey: ['driver-deliveries', drivers?.[0]?.id],
    enabled: !!drivers?.[0]?.id,
    queryFn: async () => {
      if (!drivers?.[0]?.id) return [];

      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          customer_name,
          total,
          status,
          commission
        `)
        .eq('driver_id', drivers[0].id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return orders.map(order => ({
        id: order.id,
        orderId: order.id,
        date: new Date(order.created_at),
        customer: order.customer_name,
        amount: order.total,
        status: mapOrderStatusToDeliveryStatus(order.status),
        commission: order.commission || 0
      }));
    }
  });

  if (isLoadingDrivers) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
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
            <BreadcrumbPage>Entregadores</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Entregadores</h1>
      </div>

      <DriversMenu />

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Gerencie entregadores e acompanhe métricas
        </p>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Entregador
        </Button>
      </div>

      {driverMetrics && (
        <DriverMetrics
          totalDeliveries={Number(driverMetrics.total_deliveries)}
          successRate={Number(driverMetrics.success_rate)}
          totalEarnings={Number(driverMetrics.total_earnings)}
          completionRate={Number(driverMetrics.completion_rate)}
        />
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Histórico de Entregas</h2>
        {deliveries && <DeliveryHistory deliveries={deliveries} />}
      </div>
    </div>
  );
};

export default AdminDrivers;