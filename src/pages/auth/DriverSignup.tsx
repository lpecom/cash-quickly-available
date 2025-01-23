import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Bike } from "lucide-react";

const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  phone: z.string().min(10, "Telefone inválido"),
  motorcyclePlate: z.string().min(7, "Placa da moto inválida"),
  motorcycleModel: z.string().min(2, "Modelo da moto é obrigatório"),
  motorcycleYear: z.string().regex(/^\d{4}$/, "Ano inválido"),
  cnhNumber: z.string().min(11, "Número da CNH inválido"),
  cnhExpiration: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  address: z.string().min(5, "Endereço é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado inválido"),
  postalCode: z.string().min(8, "CEP inválido"),
});

type SignupForm = z.infer<typeof signupSchema>;

const DriverSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phone: "",
      motorcyclePlate: "",
      motorcycleModel: "",
      motorcycleYear: "",
      cnhNumber: "",
      cnhExpiration: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      setIsLoading(true);
      
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: data.fullName,
          phone: data.phone,
          motorcycle_plate: data.motorcyclePlate,
          motorcycle_model: data.motorcycleModel,
          motorcycle_year: parseInt(data.motorcycleYear),
          cnh_number: data.cnhNumber,
          cnh_expiration: data.cnhExpiration,
          address: data.address,
          city: data.city,
          state: data.state,
          postal_code: data.postalCode,
        })
        .eq("email", data.email);

      if (profileError) throw profileError;

      toast.success("Conta criada com sucesso! Verifique seu email para confirmar.");
      navigate("/auth/motoboy");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 relative">
        <Button
          variant="ghost"
          className="absolute -top-16 left-0"
          onClick={() => navigate("/auth/motoboy")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="text-center space-y-2">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bike className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Seja um Entregador Parceiro
          </h1>
          <p className="text-muted-foreground">
            Cadastre-se para começar a fazer entregas
          </p>
        </div>

        <div className="bg-card border rounded-lg shadow-sm p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="João da Silva" {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input placeholder="joao@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="font-medium">Informações da Moto</h3>
                <FormField
                  control={form.control}
                  name="motorcyclePlate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placa da Moto</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC1234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="motorcycleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo da Moto</FormLabel>
                      <FormControl>
                        <Input placeholder="Honda CG 160" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="motorcycleYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano da Moto</FormLabel>
                      <FormControl>
                        <Input placeholder="2020" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="font-medium">Documentação</h3>
                <FormField
                  control={form.control}
                  name="cnhNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número da CNH</FormLabel>
                      <FormControl>
                        <Input placeholder="00123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cnhExpiration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validade da CNH</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="font-medium">Endereço</h3>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, número" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="São Paulo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="SP" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default DriverSignup;