import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GeneralSettingsProps {
  config?: {
    business_info?: {
      name: string;
      address: string;
      phone: string;
      email: string;
      timezone: string;
    };
    operating_hours?: Record<string, { start: string; end: string }>;
  };
}

export function GeneralSettings({ config }: GeneralSettingsProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      name: config?.business_info?.name ?? "",
      address: config?.business_info?.address ?? "",
      phone: config?.business_info?.phone ?? "",
      email: config?.business_info?.email ?? "",
      timezone: config?.business_info?.timezone ?? "UTC",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase
        .from('configurations')
        .update({ value: { ...config?.business_info, ...values } })
        .eq('category', 'general')
        .eq('key', 'business_info');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
      toast.success("Settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update settings");
      console.error("Error updating settings:", error);
    },
  });

  const onSubmit = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Configure your business information and operating hours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter timezone in format: UTC, America/New_York, etc.
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