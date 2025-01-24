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
import { Building2 } from "lucide-react";

const authSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  businessName: z.string().min(2, "Nome da empresa é obrigatório"),
  fullName: z.string().min(2, "Nome completo é obrigatório"),
});

type AuthForm = z.infer<typeof authSchema>;

const SellerAuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const form = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      businessName: "",
      fullName: "",
    },
  });

  const onSubmit = async (data: AuthForm) => {
    try {
      setIsLoading(true);
      
      if (isSignUp) {
        console.log('Attempting to sign up:', data.email);
        const { error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              role: 'seller',
              business_name: data.businessName,
              full_name: data.fullName,
            }
          }
        });

        if (signUpError) {
          console.error('Signup error:', signUpError);
          throw signUpError;
        }
        toast.success("Cadastro realizado com sucesso!");
      } else {
        console.log('Attempting to sign in:', data.email);
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (signInError) {
          console.error('Sign in error:', signInError);
          throw signInError;
        }

        if (!signInData.user) {
          console.error('No user data returned');
          throw new Error("Erro ao obter dados do usuário");
        }

        console.log('User signed in:', signInData.user.id);

        // Verify if the user has a seller profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', signInData.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }

        console.log('User profile:', profile);

        if (!profile || profile.role !== 'seller') {
          console.error('Invalid role:', profile?.role);
          await supabase.auth.signOut();
          throw new Error("Esta conta não tem permissão de vendedor");
        }

        console.log('Login successful, navigating to /seller');
        toast.success("Login realizado com sucesso!");
        navigate("/seller");
      }
    } catch (error: any) {
      console.error("Error in authentication:", error);
      toast.error(error.message || "Erro na autenticação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Área do Vendedor
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Crie sua conta para começar" : "Faça login para continuar"}
          </p>
        </div>

        <div className="bg-card border rounded-lg shadow-sm p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
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

              {isSignUp && (
                <>
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Empresa</FormLabel>
                        <FormControl>
                          <Input placeholder="Sua Empresa LTDA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processando..." : isSignUp ? "Cadastrar" : "Entrar"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Já tem uma conta?" : "Ainda não tem uma conta?"}{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Faça login" : "Cadastre-se aqui"}
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAuthPage;