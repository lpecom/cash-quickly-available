import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NotificationSettingsProps {
  config?: {
    preferences?: {
      order_created: string[];
      order_accepted: string[];
      order_delivered: string[];
      order_cancelled: string[];
    };
  };
}

const notificationTypes = [
  { id: "email", label: "Email" },
  { id: "push", label: "Push Notifications" },
  { id: "sms", label: "SMS" },
];

const events = [
  { id: "order_created", label: "Order Created" },
  { id: "order_accepted", label: "Order Accepted" },
  { id: "order_delivered", label: "Order Delivered" },
  { id: "order_cancelled", label: "Order Cancelled" },
];

export function NotificationSettings({ config }: NotificationSettingsProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      preferences: config?.preferences ?? {
        order_created: ["email", "push"],
        order_accepted: ["email", "push", "sms"],
        order_delivered: ["email", "push"],
        order_cancelled: ["email", "push", "sms"],
      },
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase
        .from('configurations')
        .update({ value: values.preferences })
        .eq('category', 'notifications')
        .eq('key', 'preferences');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
      toast.success("Notification settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update notification settings");
      console.error("Error updating notification settings:", error);
    },
  });

  const onSubmit = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure how and when notifications are sent
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {events.map((event) => (
              <FormField
                key={event.id}
                control={form.control}
                name={`preferences.${event.id}`}
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel>{event.label}</FormLabel>
                    <div className="space-y-2">
                      {notificationTypes.map((type) => (
                        <FormField
                          key={type.id}
                          control={form.control}
                          name={`preferences.${event.id}`}
                          render={({ field }) => (
                            <FormItem
                              key={type.id}
                              className="flex flex-row items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(type.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...field.value, type.id]
                                      : field.value?.filter((value: string) => value !== type.id);
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {type.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}