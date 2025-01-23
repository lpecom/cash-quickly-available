import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, DollarSign, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";
import { addDays, format, startOfDay, endOfDay, subDays } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardOrderList } from "@/components/admin/DashboardOrderList";

const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-dashboard-stats', dateRange],
    queryFn: async () => {
      const startDate = dateRange?.from ? startOfDay(dateRange.from) : startOfDay(new Date());
      const endDate = dateRange?.to ? endOfDay(dateRange.to) : endOfDay(new Date());

      // Get orders within date range
      const { data: periodOrders, error: ordersError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (ordersError) throw ordersError;

      // Get active drivers
      const { data: activeDrivers, error: driversError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'motoboy');

      if (driversError) throw driversError;

      // Calculate metrics
      const totalOrders = periodOrders?.length || 0;
      const totalEarnings = periodOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      const completedOrders = periodOrders?.filter(order => order.status === 'delivered').length || 0;
      const deliveryRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

      // Calculate daily earnings for chart
      const dailyEarnings = periodOrders?.reduce((acc: any[], order) => {
        const date = format(new Date(order.created_at), 'MMM dd');
        const existing = acc.find(item => item.date === date);
        if (existing) {
          existing.amount += order.total;
        } else {
          acc.push({ date, amount: order.total });
        }
        return acc;
      }, []) || [];

      return {
        totalOrders,
        activeDrivers: activeDrivers?.length || 0,
        totalEarnings,
        deliveryRate,
        dailyEarnings,
      };
    },
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-dashboard-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            quantity,
            product:products(
              name
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Skeleton className="h-10 w-72" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              No período selecionado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregadores</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeDrivers}</div>
            <p className="text-xs text-muted-foreground">
              Ativos na plataforma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats?.totalEarnings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              No período selecionado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Entrega</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.deliveryRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Pedidos entregues com sucesso
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faturamento Diário</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={stats?.dailyEarnings}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Faturamento"]}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {!ordersLoading && orders && (
        <DashboardOrderList orders={orders} />
      )}
    </div>
  );
};

export default AdminDashboard;