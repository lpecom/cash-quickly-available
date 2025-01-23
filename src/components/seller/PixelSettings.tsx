import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Globe, Share2, BarChart } from "lucide-react";
import { toast } from "sonner";

interface PixelSettingsProps {
  config?: {
    pixels?: {
      facebook?: string;
      google?: string;
      tiktok?: string;
      taboola?: string;
    };
  };
}

export function PixelSettings({ config }: PixelSettingsProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      facebook: config?.pixels?.facebook ?? "",
      google: config?.pixels?.google ?? "",
      tiktok: config?.pixels?.tiktok ?? "",
      taboola: config?.pixels?.taboola ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase
        .from('configurations')
        .update({ value: { pixels: values } })
        .eq('category', 'integrations')
        .eq('key', 'pixels');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
      toast.success("Pixel settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update pixel settings");
      console.error("Error updating pixel settings:", error);
    },
  });

  const onSubmit = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pixel Settings</CardTitle>
        <CardDescription>
          Configure tracking pixels for your store
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Facebook className="h-4 w-4" />
                    Facebook Pixel ID
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Facebook Pixel ID" {...field} />
                  </FormControl>
                  <FormDescription>
                    Used for Facebook Ads tracking and analytics
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="google"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Google Tag ID
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Google Tag ID" {...field} />
                  </FormControl>
                  <FormDescription>
                    Used for Google Analytics and Google Ads tracking
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tiktok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    TikTok Pixel ID
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your TikTok Pixel ID" {...field} />
                  </FormControl>
                  <FormDescription>
                    Used for TikTok Ads tracking and analytics
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taboola"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    Taboola Pixel ID
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Taboola Pixel ID" {...field} />
                  </FormControl>
                  <FormDescription>
                    Used for Taboola advertising tracking
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