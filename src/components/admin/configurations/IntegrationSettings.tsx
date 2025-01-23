import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface IntegrationSettingsProps {
  config?: {
    services?: {
      maps_provider: string;
      sms_provider: string;
      payment_gateway: string;
    };
  };
}

const mapProviders = [
  { value: "mapbox", label: "Mapbox" },
  { value: "google", label: "Google Maps" },
  { value: "osm", label: "OpenStreetMap" },
];

const smsProviders = [
  { value: "twilio", label: "Twilio" },
  { value: "messagebird", label: "MessageBird" },
  { value: "vonage", label: "Vonage" },
];

const paymentGateways = [
  { value: "stripe", label: "Stripe" },
  { value: "paypal", label: "PayPal" },
  { value: "mercadopago", label: "MercadoPago" },
];

export function IntegrationSettings({ config }: IntegrationSettingsProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      maps_provider: config?.services?.maps_provider ?? "mapbox",
      sms_provider: config?.services?.sms_provider ?? "twilio",
      payment_gateway: config?.services?.payment_gateway ?? "stripe",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase
        .from('configurations')
        .update({ value: values })
        .eq('category', 'integrations')
        .eq('key', 'services');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
      toast.success("Integration settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update integration settings");
      console.error("Error updating integration settings:", error);
    },
  });

  const onSubmit = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Settings</CardTitle>
        <CardDescription>
          Configure third-party service integrations
        
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="maps_provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maps Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a maps provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mapProviders.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the provider for maps and location services
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sms_provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SMS Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an SMS provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {smsProviders.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the provider for SMS notifications
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_gateway"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Gateway</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment gateway" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentGateways.map((gateway) => (
                        <SelectItem key={gateway.value} value={gateway.value}>
                          {gateway.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the payment processing service
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4">
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}