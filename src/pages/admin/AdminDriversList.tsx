import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Ban, 
  Info, 
  Package, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminDriversList = () => {
  const { data: driversWithMetrics, isLoading } = useQuery({
    queryKey: ['drivers-with-metrics'],
    queryFn: async () => {
      // First get all drivers
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'motoboy');

      if (error) throw error;

      // Then get metrics for each driver
      const driversWithMetrics = await Promise.all(
        profiles.map(async (driver) => {
          const { data: metrics } = await supabase
            .rpc('get_driver_metrics', {
              driver_uuid: driver.id
            });

          // Get last delivery
          const { data: lastDelivery } = await supabase
            .from('orders')
            .select('*')
            .eq('driver_id', driver.id)
            .eq('status', 'delivered')
            .order('delivery_completed_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...driver,
            metrics: metrics?.[0] || {
              total_deliveries: 0,
              success_rate: 0,
              total_earnings: 0,
              completion_rate: 0
            },
            lastDelivery
          };
        })
      );

      return driversWithMetrics;
    }
  });

  const handleBanDriver = async (driverId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: null })
        .eq('id', driverId);

      if (error) throw error;
      toast.success("Motorista banido com sucesso");
    } catch (error) {
      toast.error("Erro ao banir motorista");
    }
  };

  if (isLoading) {
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
            Lista de entregadores cadastrados
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Entregador
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {driversWithMetrics?.map((driver) => (
          <Card key={driver.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {driver.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Link
                      to={`/admin/drivers/${driver.id}`}
                      className="font-semibold hover:text-primary"
                    >
                      {driver.full_name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {driver.phone || 'Sem telefone'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link to={`/admin/drivers/${driver.id}`}>
                        <Info className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleBanDriver(driver.id)}
                    >
                      <Ban className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Package className="mr-2 h-4 w-4" />
                      Total Entregas
                    </div>
                    <p className="font-medium">{driver.metrics.total_deliveries}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Taxa de Sucesso
                    </div>
                    <p className="font-medium">{driver.metrics.success_rate}%</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      Última Entrega
                    </div>
                    <p className="font-medium">
                      {driver.lastDelivery 
                        ? format(new Date(driver.lastDelivery.delivery_completed_at), 'dd/MM/yyyy')
                        : 'Nenhuma'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Status
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
                      Ativo
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDriversList;