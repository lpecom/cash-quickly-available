import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Link, Check } from "lucide-react";
import { toast } from "sonner";

interface OnboardingFormValues {
  store_url: string;
  access_token: string;
  location_id: string;
}

export function ShopifyOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const queryClient = useQueryClient();

  const form = useForm<OnboardingFormValues>({
    defaultValues: {
      store_url: "",
      access_token: "",
      location_id: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: OnboardingFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Extract store name from the full URL
      const storeUrl = values.store_url.replace('https://', '').replace('.myshopify.com', '');

      const { error } = await supabase
        .from('seller_profiles')
        .update({
          shopify_app_secret: values.access_token,
          shopify_settings: {
            store_name: storeUrl,
            location_id: values.location_id,
          },
          shopify_onboarding_status: 'completed',
        })
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-profile'] });
      toast.success("Shopify integration completed successfully");
    },
    onError: (error) => {
      toast.error("Failed to complete Shopify integration");
      console.error("Error completing Shopify integration:", error);
    },
  });

  const onSubmit = (values: OnboardingFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Step 1: Create Private App
          </CardTitle>
          <CardDescription>
            Create a new private app in your Shopify admin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            <li>Go to your Shopify admin panel</li>
            <li>Navigate to Settings → Apps and sales channels</li>
            <li>Click "Develop apps" and create a new app</li>
            <li>In Configuration, select "Admin API integration"</li>
            <li>Under Admin API access scopes, add these permissions:
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>read_products, write_products</li>
                <li>read_orders, write_orders</li>
                <li>read_inventory, write_inventory</li>
                <li>read_locations</li>
              </ul>
            </li>
            <li>Install the app and copy the Admin API access token</li>
          </ol>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setCurrentStep(2)}
          >
            I've created the app
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {currentStep >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Step 2: Configure Store Connection
            </CardTitle>
            <CardDescription>
              Enter your Shopify store details and access token
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="store_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="your-store.myshopify.com" />
                      </FormControl>
                      <FormDescription>
                        Your full Shopify store URL (e.g., your-store.myshopify.com)
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="access_token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin API Access Token</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="shpat_xxxxxxxxxxxxxxxxxxxxx" />
                      </FormControl>
                      <FormDescription>
                        The Admin API access token from your private app
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your Shopify location ID" />
                      </FormControl>
                      <FormDescription>
                        The ID of the location where orders will be fulfilled. You can find this in Shopify admin under Settings → Locations
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    "Completing setup..."
                  ) : (
                    <>
                      Complete Setup
                      <Check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}