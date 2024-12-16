import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MetricCard } from "@/components/MetricCard";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  PercentIcon,
} from "lucide-react";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <SidebarTrigger />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            <MetricCard
              title="Total Revenue"
              value="$12,345"
              icon={DollarSign}
              trend={{ value: 12, isPositive: true }}
            />
            <MetricCard
              title="Commission"
              value="$1,234"
              icon={PercentIcon}
              trend={{ value: 8, isPositive: true }}
            />
            <MetricCard
              title="Orders"
              value="156"
              icon={ShoppingCart}
              trend={{ value: 5, isPositive: true }}
            />
            <MetricCard
              title="Products"
              value="48"
              icon={Package}
              trend={{ value: 2, isPositive: false }}
            />
            <MetricCard
              title="Customers"
              value="2,345"
              icon={Users}
              trend={{ value: 10, isPositive: true }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Sales Volume</h2>
              <p className="text-muted-foreground">
                No data available for this chart yet.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Orders by Status</h2>
              <p className="text-muted-foreground">
                No data available for this chart yet.
              </p>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;