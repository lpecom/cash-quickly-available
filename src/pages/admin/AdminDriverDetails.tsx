import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, DollarSign, Package, CheckCircle } from "lucide-react";
import { DeliveryHistory } from "@/components/admin/drivers/DeliveryHistory";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminDriverDetails = () => {
  const { driverId } = useParams();

  const { data: driverProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['driver-profile', driverId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', driverId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: driverMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['driver-metrics', driverId],
    queryFn: async () => {
      if (!driverId) return null;
      
      const { data, error } = await supabase
        .rpc('get_driver_metrics', {
          driver_uuid: driverId
        });

      if (error) throw error;
      return data[0];
    }
  });

  const { data: deliveries, isLoading: isLoadingDeliveries } = useQuery({
    queryKey: ['driver-deliveries', driverId],
    queryFn: async () => {
      if (!driverId) return [];

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
        .eq('driver_id', driverId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return orders.map(order => ({
        id: order.id,
        orderId: order.id,
        date: new Date(order.created_at),
        customer: order.customer_name,
        amount: order.total,
        status: order.status === 'delivered' ? 'completed' : 
               order.status === 'not_delivered' ? 'failed' : 'cancelled',
        commission: order.commission || 0
      }));
    }
  });

  if (isLoadingProfile || !driverProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{driverProfile.full_name}</h1>
        <p className="text-muted-foreground">Detalhes do entregador</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entregas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {driverMetrics?.total_deliveries || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {driverMetrics?.success_rate || 0}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ganhos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(driverMetrics?.total_earnings || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conclusão
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {driverMetrics?.completion_rate || 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{driverProfile.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium">{driverProfile.phone || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Placa da Moto</p>
              <p className="font-medium">{driverProfile.motorcycle_plate || 'Não informada'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Modelo da Moto</p>
              <p className="font-medium">{driverProfile.motorcycle_model || 'Não informado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Histórico de Entregas</h2>
        {deliveries && <DeliveryHistory deliveries={deliveries} />}
      </div>
    </div>
  );
};

export default AdminDriverDetails;