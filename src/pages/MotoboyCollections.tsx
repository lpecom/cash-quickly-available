import { useState } from "react";
import { Package, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderCard } from "@/components/delivery/OrderCard";
import MobileNav from "@/components/MobileNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type OrderWithItems = Tables<"orders"> & {
  order_items: Array<{
    quantity: number;
    price_at_time: number;
    products: {
      name: string;
    } | null;
  }>;
};

const MotoboyCollections = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["accepted-orders"],
    queryFn: async () => {
      console.log("Fetching accepted orders...");
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            quantity,
            price_at_time,
            products (
              name
            )
          )
        `)
        .eq('driver_id', user.user?.id)
        .in('status', ['confirmed', 'on_route', 'not_delivered'])
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Orders fetched:", data);
      return data as OrderWithItems[];
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <p>Carregando coletas...</p>
      </div>
    );
  }

  const toCollectOrders = orders?.filter(order => order.status === 'confirmed') || [];
  const toReturnOrders = orders?.filter(order => order.status === 'not_delivered') || [];

  return (
    <div className="min-h-screen bg-secondary pb-16">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="container mx-auto p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Coletas</h1>
            <p className="text-muted-foreground">
              Gerencie suas coletas e devoluções
            </p>
          </div>

          <Tabs defaultValue="collect" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="collect" className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Para Coletar ({toCollectOrders.length})
              </TabsTrigger>
              <TabsTrigger value="return" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Para Devolver ({toReturnOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="collect" className="space-y-4">
              {toCollectOrders.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Nenhum pedido para coletar
                  </p>
                </div>
              ) : (
                toCollectOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={{
                      id: order.id,
                      customer_name: order.customer_name,
                      address: order.address,
                      status: order.status,
                      amount: `R$ ${order.total.toFixed(2)}`,
                      items: `${order.order_items?.length || 0} items`,
                      phone: order.phone,
                      accepted_at: order.accepted_at,
                      created_at: order.created_at,
                      total: order.total,
                      deliveryInstructions: order.delivery_instructions || undefined,
                      products: order.order_items?.map((item) => ({
                        name: item.products?.name || 'Produto',
                        quantity: item.quantity
                      }))
                    }}
                    onStartDelivery={() => {}}
                    onContactCustomer={() => {}}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="return" className="space-y-4">
              {toReturnOrders.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Nenhum pedido para devolver
                  </p>
                </div>
              ) : (
                toReturnOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={{
                      id: order.id,
                      customer_name: order.customer_name,
                      address: order.address,
                      status: order.status,
                      amount: `R$ ${order.total.toFixed(2)}`,
                      items: `${order.order_items?.length || 0} items`,
                      phone: order.phone,
                      accepted_at: order.accepted_at,
                      created_at: order.created_at,
                      total: order.total,
                      deliveryInstructions: order.delivery_instructions || undefined,
                      products: order.order_items?.map((item) => ({
                        name: item.products?.name || 'Produto',
                        quantity: item.quantity
                      }))
                    }}
                    onStartDelivery={() => {}}
                    onContactCustomer={() => {}}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
      <MobileNav />
    </div>
  );
};

export default MotoboyCollections;