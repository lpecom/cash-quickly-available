import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PaymentSettingsProps {
  config?: {
    methods?: {
      cash: boolean;
      card: boolean;
      transaction_fee: number;
      fixed_fee: number;
    };
  };
}

export function PaymentSettings({ config }: PaymentSettingsProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      cash: config?.methods?.cash ?? true,
      card: config?.methods?.card ?? true,
      transaction_fee: config?.methods?.transaction_fee ?? 0.029,
      fixed_fee: config?.methods?.fixed_fee ?? 0.30,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase
        .from('configurations')
        .update({ value: values })
        .eq('category', 'payment')
        .eq('key', 'methods');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
      toast.success("Payment settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update payment settings");
      console.error("Error updating payment settings:", error);
    },
  });

  const onSubmit = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
        <CardDescription>
          Configure payment methods and processing fees
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cash"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Accept Cash Payments</FormLabel>
                    <FormDescription>
                      Allow customers to pay with cash on delivery
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
            <FormField
              control={form.control}
              name="card"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Accept Card Payments</FormLabel>
                    <FormDescription>
                      Allow customers to pay with credit/debit cards
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
            <FormField
              control={form.control}
              name="transaction_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Fee Rate</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      min="0" 
                      max="1" 
                      step="0.001" 
                    />
                  </FormControl>
                  <FormDescription>Enter as decimal (e.g., 0.029 for 2.9%)</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fixed_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fixed Fee</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" step="0.01" />
                  </FormControl>
                  <FormDescription>Fixed fee per transaction (e.g., 0.30)</FormDescription>
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