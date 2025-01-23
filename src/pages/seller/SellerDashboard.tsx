import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SellerDashboard() {
  const { data: sellerStats, isLoading } = useQuery({
    queryKey: ['seller-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: sellerProfile, error: profileError } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        toast.error('Error loading seller profile');
        throw profileError;
      }

      // Get today's orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: todayOrders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', sellerProfile.id)
        .gte('created_at', today.toISOString());

      if (ordersError) {
        toast.error('Error loading orders');
        throw ordersError;
      }

      // Get active products
      const { data: activeProducts, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('active', true);

      if (productsError) {
        toast.error('Error loading products');
        throw productsError;
      }

      const todaySales = todayOrders?.reduce((total, order) => total + (order.total || 0), 0) || 0;
      const todayOrderCount = todayOrders?.length || 0;
      const activeProductCount = activeProducts?.length || 0;
      
      // Calculate conversion rate (example: orders / product views)
      const conversionRate = todayOrderCount > 0 ? 
        ((todayOrderCount / (activeProductCount || 1)) * 100).toFixed(1) : 
        0;

      return {
        todaySales,
        todayOrderCount,
        activeProductCount,
        conversionRate
      };
    },
  });

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard do Vendedor</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {sellerStats?.todaySales.toFixed(2) || '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              +0% em relação a ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellerStats?.todayOrderCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              +0% em relação a ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellerStats?.activeProductCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              +0 novos produtos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellerStats?.conversionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              +0% em relação a ontem
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}