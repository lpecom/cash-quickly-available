import { useQuery } from "@tanstack/react-query";
import { Settings, Building2, Truck, Wallet, Bell, Shield, Network } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { GeneralSettings } from "@/components/admin/configurations/GeneralSettings";
import { DeliverySettings } from "@/components/admin/configurations/DeliverySettings";
import { PaymentSettings } from "@/components/admin/configurations/PaymentSettings";
import { NotificationSettings } from "@/components/admin/configurations/NotificationSettings";
import { SecuritySettings } from "@/components/admin/configurations/SecuritySettings";
import { IntegrationSettings } from "@/components/admin/configurations/IntegrationSettings";

const AdminConfigurations = () => {
  const { data: configurations, isLoading } = useQuery({
    queryKey: ['configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('configurations')
        .select('*');
      
      if (error) throw error;
      
      // Transform array to object grouped by category
      return data.reduce((acc, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = {};
        }
        acc[curr.category][curr.key] = curr.value;
        return acc;
      }, {} as Record<string, Record<string, any>>);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
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
            <BreadcrumbPage>Configurations</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Configurations</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Delivery
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings config={configurations?.general} />
        </TabsContent>
        <TabsContent value="delivery">
          <DeliverySettings config={configurations?.delivery} />
        </TabsContent>
        <TabsContent value="payment">
          <PaymentSettings config={configurations?.payment} />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings config={configurations?.notifications} />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings config={configurations?.security} />
        </TabsContent>
        <TabsContent value="integrations">
          <IntegrationSettings config={configurations?.integrations} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminConfigurations;