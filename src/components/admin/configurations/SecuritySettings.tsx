import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SecuritySettingsProps {
  config?: {
    authentication?: {
      require_email_verification: boolean;
      allow_social_login: boolean;
      session_timeout: number;
    };
  };
}

export function SecuritySettings({ config }: SecuritySettingsProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      require_email_verification: config?.authentication?.require_email_verification ?? true,
      allow_social_login: config?.authentication?.allow_social_login ?? true,
      session_timeout: config?.authentication?.session_timeout ?? 3600,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase
        .from('configurations')
        .update({ value: values })
        .eq('category', 'security')
        .eq('key', 'authentication');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
      toast.success("Security settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update security settings");
      console.error("Error updating security settings:", error);
    },
  });

  const onSubmit = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Configure authentication and security preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="require_email_verification"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Require Email Verification</FormLabel>
                    <FormDescription>
                      Users must verify their email before accessing the platform
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
              name="allow_social_login"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Allow Social Login</FormLabel>
                    <FormDescription>
                      Enable authentication through social media platforms
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
              name="session_timeout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Timeout (seconds)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="300" step="300" />
                  </FormControl>
                  <FormDescription>
                    Time in seconds before an inactive session expires (minimum 300s)
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