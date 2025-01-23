import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, DollarSign, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get today's orders
      const { data: todayOrders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', today.toISOString());

      if (ordersError) throw ordersError;

      // Get active drivers (those with orders today)
      const { data: activeDrivers, error: driversError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'motoboy');

      if (driversError) throw driversError;

      // Get active drivers with orders
      const { data: driversWithOrders, error: activeDriversError } = await supabase
        .from('orders')
        .select('driver_id')
        .gte('created_at', today.toISOString())
        .not('driver_id', 'is', null);

      if (activeDriversError) throw activeDriversError;

      // Calculate total earnings for today
      const todayEarnings = todayOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

      // Calculate average delivery time (mock for now as we don't store delivery timestamps)
      const avgDeliveryTime = "25min";

      return {
        todayOrders: todayOrders?.length || 0,
        activeDrivers: activeDrivers?.length || 0,
        driversOnDelivery: new Set(driversWithOrders?.map(o => o.driver_id)).size,
        todayEarnings,
        avgDeliveryTime,
      };
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.todayOrders}</div>
            <p className="text-xs text-muted-foreground">Total de pedidos do dia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregadores Ativos</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeDrivers}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.driversOnDelivery} em entrega
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats?.todayEarnings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Valor total do dia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio Entrega</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgDeliveryTime}</div>
            <p className="text-xs text-muted-foreground">Média do dia</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;