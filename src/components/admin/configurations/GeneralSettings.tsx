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
      toast.success("Configurações atualizadas com sucesso");
    },
    onError: (error) => {
      toast.error("Falha ao atualizar configurações");
      console.error("Erro ao atualizar configurações:", error);
    },
  });

  const onSubmit = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Gerais</CardTitle>
        <CardDescription>
          Configure as informações do seu negócio e horário de funcionamento
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
                  <FormLabel>Nome da Empresa</FormLabel>
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
                  <FormLabel>Endereço</FormLabel>
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
                  <FormLabel>Telefone</FormLabel>
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
                  <FormLabel>E-mail</FormLabel>
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
                  <FormLabel>Fuso Horário</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Digite o fuso horário no formato: UTC, America/Sao_Paulo, etc.
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4">
              Salvar Alterações
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}