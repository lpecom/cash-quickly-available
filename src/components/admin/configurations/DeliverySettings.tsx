import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeliverySettingsProps {
  config?: {
    rules?: {
      radius_km: number;
      base_fee: number;
      minimum_order: number;
      driver_commission: number;
      auto_assignment: boolean;
    };
  };
}

export function DeliverySettings({ config }: DeliverySettingsProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      radius_km: config?.rules?.radius_km ?? 10,
      base_fee: config?.rules?.base_fee ?? 5,
      minimum_order: config?.rules?.minimum_order ?? 15,
      driver_commission: config?.rules?.driver_commission ?? 0.1,
      auto_assignment: config?.rules?.auto_assignment ?? false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase
        .from('configurations')
        .update({ value: values })
        .eq('category', 'delivery')
        .eq('key', 'rules');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
      toast.success("Delivery settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update delivery settings");
      console.error("Error updating delivery settings:", error);
    },
  });

  const onSubmit = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Settings</CardTitle>
        <CardDescription>
          Configure delivery rules and commission rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="radius_km"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Radius (km)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" step="0.1" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="base_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Delivery Fee</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" step="0.01" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minimum_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Order Amount</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" step="0.01" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="driver_commission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver Commission Rate</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                    />
                  </FormControl>
                  <FormDescription>Enter as decimal (e.g., 0.10 for 10%)</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="auto_assignment"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Automatic Order Assignment</FormLabel>
                    <FormDescription>
                      Automatically assign orders to available drivers
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
            <Button type="submit" className="mt-4">
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}