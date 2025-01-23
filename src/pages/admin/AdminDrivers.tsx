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
import { Link } from "react-router-dom";
import { toast } from "sonner";

const mapOrderStatusToDeliveryStatus = (orderStatus: string) => {
  switch (orderStatus) {
    case 'delivered':
      return 'completed' as const;
    case 'not_delivered':
      return 'failed' as const;
    default:
      return 'cancelled' as const;
  }
};

const AdminDrivers = () => {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  const { data: drivers, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'motoboy');

      if (error) {
        toast.error("Erro ao carregar entregadores");
        throw error;
      }
      return profiles;
    }
  });

  const { data: driverMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['driver-metrics', selectedDriverId],
    enabled: !!selectedDriverId,
    queryFn: async () => {
      if (!selectedDriverId) return null;
      
      const { data, error } = await supabase
        .rpc('get_driver_metrics', {
          driver_uuid: selectedDriverId
        });

      if (error) {
        toast.error("Erro ao carregar métricas do entregador");
        throw error;
      }
      return data[0];
    }
  });

  const { data: deliveries, isLoading: isLoadingDeliveries } = useQuery({
    queryKey: ['driver-deliveries', selectedDriverId],
    enabled: !!selectedDriverId,
    queryFn: async () => {
      if (!selectedDriverId) return [];

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
        .eq('driver_id', selectedDriverId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        toast.error("Erro ao carregar entregas");
        throw error;
      }

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Entregadores</h1>
          <p className="text-muted-foreground">
            {drivers?.length || 0} entregadores cadastrados
          </p>
        </div>
        <Button asChild>
          <Link to="/driver-signup">
            <Plus className="mr-2 h-4 w-4" />
            Novo Entregador
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {drivers?.map((driver) => (
          <div 
            key={driver.id}
            className="bg-card border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {driver.full_name || 'Nome não informado'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {driver.phone || 'Telefone não informado'}
                </p>
                {driver.motorcycle_plate && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Placa: {driver.motorcycle_plate}
                  </p>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                asChild
              >
                <Link to={`/admin/drivers/${driver.id}`}>
                  Ver detalhes
                </Link>
              </Button>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cidade</p>
                  <p className="font-medium">{driver.city || 'Não informada'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <p className="font-medium">{driver.state || 'Não informado'}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button 
                className="w-full" 
                variant="secondary"
                onClick={() => setSelectedDriverId(driver.id)}
              >
                Ver métricas
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedDriverId && driverMetrics && (
        <>
          <h2 className="text-xl font-semibold mt-8 mb-4">Métricas do Entregador</h2>
          <DriverMetrics
            totalDeliveries={Number(driverMetrics.total_deliveries)}
            successRate={Number(driverMetrics.success_rate)}
            totalEarnings={Number(driverMetrics.total_earnings)}
            completionRate={Number(driverMetrics.completion_rate)}
          />
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Histórico de Entregas</h2>
            {deliveries && <DeliveryHistory deliveries={deliveries} />}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDrivers;