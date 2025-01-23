import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

type NotificationType = "email" | "push" | "sms";
type EventType = "order_created" | "order_accepted" | "order_delivered" | "order_cancelled";

interface NotificationPreferences {
  [key: string]: NotificationType[];
}

interface FormValues {
  preferences: NotificationPreferences;
}

interface NotificationSettingsProps {
  config?: {
    preferences?: NotificationPreferences;
  };
}

const notificationTypes: Array<{ id: NotificationType; label: string }> = [
  { id: "email", label: "Email" },
  { id: "push", label: "Push Notifications" },
  { id: "sms", label: "SMS" },
];

const events: Array<{ id: EventType; label: string }> = [
  { id: "order_created", label: "Order Created" },
  { id: "order_accepted", label: "Order Accepted" },
  { id: "order_delivered", label: "Order Delivered" },
  { id: "order_cancelled", label: "Order Cancelled" },
];

export function NotificationSettings({ config }: NotificationSettingsProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
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
    mutationFn: async (values: FormValues) => {
      const { error } = await supabase
        .from('configurations')
        .update({ value: values.preferences as Json })
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

  const onSubmit = (values: FormValues) => {
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
                        <FormItem
                          key={type.id}
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={(field.value as NotificationType[])?.includes(type.id)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value as NotificationType[] || [];
                                const updatedValue = checked
                                  ? [...currentValue, type.id]
                                  : currentValue.filter((value) => value !== type.id);
                                field.onChange(updatedValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {type.label}
                          </FormLabel>
                        </FormItem>
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