import { ShopifySettings } from "@/components/seller/ShopifySettings";
import { PixelSettings } from "@/components/seller/PixelSettings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function SellerIntegrations() {
  const { data: configurations } = useQuery({
    queryKey: ['configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('configurations')
        .select('*')
        .eq('category', 'integrations');
      
      if (error) throw error;
      
      return data.reduce((acc: any, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Integrações</h1>
      <p className="text-muted-foreground">
        Gerencie suas integrações com plataformas externas
      </p>
      <div className="grid gap-6">
        <ShopifySettings />
        <PixelSettings config={configurations} />
      </div>
    </div>
  );
}