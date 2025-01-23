import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ShopifySettings {
  store_name?: string;
  location_id?: string;
}

interface SellerProfile {
  id: string;
  user_id: string;
  shopify_enabled: boolean;
  shopify_settings: ShopifySettings;
}

interface ShopifySettingsFormValues {
  shopify_enabled: boolean;
  shopify_settings: ShopifySettings;
}

export function ShopifySettings() {
  const queryClient = useQueryClient();

  const { data: sellerProfile, isLoading } = useQuery({
    queryKey: ['seller-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data as SellerProfile;
    }
  });

  const form = useForm<ShopifySettingsFormValues>({
    defaultValues: {
      shopify_enabled: sellerProfile?.shopify_enabled ?? false,
      shopify_settings: {
        store_name: (sellerProfile?.shopify_settings as ShopifySettings)?.store_name ?? '',
        location_id: (sellerProfile?.shopify_settings as ShopifySettings)?.location_id ?? '',
      },
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ShopifySettingsFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('seller_profiles')
        .update({
          shopify_enabled: values.shopify_enabled,
          shopify_settings: values.shopify_settings as unknown as Json,
        })
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-profile'] });
      toast.success("Shopify settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update Shopify settings");
      console.error("Error updating Shopify settings:", error);
    },
  });

  const onSubmit = (values: ShopifySettingsFormValues) => {
    mutation.mutate(values);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopify Integration</CardTitle>
        <CardDescription>
          Configure your Shopify integration settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="shopify_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Shopify Integration</FormLabel>
                    <FormDescription>
                      Sync orders with your Shopify store
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("shopify_enabled") && (
              <>
                <FormField
                  control={form.control}
                  name="shopify_settings.store_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="your-store" />
                      </FormControl>
                      <FormDescription>
                        The name of your Shopify store (e.g., your-store.myshopify.com)
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shopify_settings.location_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your Shopify location ID" />
                      </FormControl>
                      <FormDescription>
                        The ID of the location where orders will be fulfilled
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button type="submit" className="mt-4">
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}