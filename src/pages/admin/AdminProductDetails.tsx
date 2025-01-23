import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save, Package, TrendingUp, ShoppingCart, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ProductFormValues, productSchema } from "@/types/product";
import { MetricCard } from "@/components/MetricCard";
import { CheckoutLinkGenerator } from "@/components/admin/products/CheckoutLinkGenerator";
import { BasicProductInfo } from "@/components/admin/products/BasicProductInfo";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const AdminProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch order metrics
  const { data: orderMetrics } = useQuery({
    queryKey: ['product-metrics', productId],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select(`
          quantity,
          price_at_time,
          orders!inner(
            created_at,
            status
          )
        `)
        .eq('product_id', productId)
        .gte('orders.created_at', thirtyDaysAgo.toISOString());

      if (error) throw error;

      const totalOrders = orderItems?.length || 0;
      const totalRevenue = orderItems?.reduce((sum, item) => 
        sum + (item.quantity * item.price_at_time), 0) || 0;
      const totalQuantity = orderItems?.reduce((sum, item) => 
        sum + item.quantity, 0) || 0;

      // Calculate previous month metrics for comparison
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const { data: previousMonthItems } = await supabase
        .from('order_items')
        .select(`
          quantity,
          price_at_time,
          orders!inner(created_at)
        `)
        .eq('product_id', productId)
        .gte('orders.created_at', sixtyDaysAgo.toISOString())
        .lt('orders.created_at', thirtyDaysAgo.toISOString());

      const prevRevenue = previousMonthItems?.reduce((sum, item) => 
        sum + (item.quantity * item.price_at_time), 0) || 0;

      const revenueTrend = prevRevenue === 0 
        ? { value: 100, isPositive: true }
        : { 
            value: Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100),
            isPositive: totalRevenue >= prevRevenue
          };

      return {
        totalOrders,
        totalRevenue,
        totalQuantity,
        revenueTrend
      };
    },
    enabled: !!productId,
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      price: "",
      variations: [],
      stock: {},
    },
  });

  useEffect(() => {
    if (product) {
      const productVariations = product.variations as { name: string; options: string[] }[] || [];
      const variations = productVariations.map(v => ({
        name: v.name || "",
        options: Array.isArray(v.options) ? v.options.join(', ') : ""
      }));
      
      const stock = typeof product.stock === 'object' && product.stock !== null
        ? product.stock as Record<string, string>
        : {};

      form.reset({
        name: product.name,
        description: product.description || "",
        sku: product.sku || "",
        price: product.price.toString(),
        variations: variations,
        stock: stock,
      });
    }
  }, [product, form]);

  const onSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);
    try {
      const processedVariations = values.variations.map(v => ({
        name: v.name,
        options: v.options.split(',').map(o => o.trim()),
      }));

      const { error } = await supabase
        .from('products')
        .update({
          name: values.name,
          description: values.description,
          sku: values.sku,
          price: parseFloat(values.price),
          variations: processedVariations,
          stock: values.stock,
        })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Produto atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Erro ao atualizar produto",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/products">Produtos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detalhes do Produto</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        <Package className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Detalhes do Produto</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard
          title="Vendas (30 dias)"
          value={`R$ ${orderMetrics?.totalRevenue?.toFixed(2) || '0,00'}`}
          icon={TrendingUp}
          trend={orderMetrics?.revenueTrend}
        />
        <MetricCard
          title="Pedidos"
          value={orderMetrics?.totalOrders?.toString() || '0'}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Unidades Vendidas"
          value={orderMetrics?.totalQuantity?.toString() || '0'}
          icon={Truck}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-muted shadow-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>Informações do Produto</CardTitle>
            </div>
            <CardDescription>
              Atualize as informações do produto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <BasicProductInfo form={form} />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {product && (
          <CheckoutLinkGenerator
            productId={productId!}
            productName={product.name}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProductDetails;