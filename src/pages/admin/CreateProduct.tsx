import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Box, Plus, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VariationField } from "@/components/admin/products/VariationField";
import { StockMatrix } from "@/components/admin/products/StockMatrix";

type ProductVariation = {
  name: string;
  options: string;
};

const productSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  sku: z.string().min(3, "SKU deve ter pelo menos 3 caracteres"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Preço inválido"),
  variations: z.array(
    z.object({
      name: z.string().min(1, "Nome da variação é obrigatório"),
      options: z.string().min(1, "Opções são obrigatórias"),
    })
  ),
  stock: z.record(z.string(), z.string().regex(/^\d+$/, "Quantidade deve ser um número inteiro")).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const CreateProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      price: "",
      variations: [] as Array<ProductVariation>,
      stock: {},
    },
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Acesso negado",
            description: "Você precisa estar logado para criar produtos.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast({
            title: "Erro",
            description: "Erro ao verificar permissões.",
            variant: "destructive",
          });
          navigate("/admin/products");
          return;
        }

        if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para criar produtos.",
            variant: "destructive",
          });
          navigate("/admin/products");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate("/admin/products");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  const createProduct = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      console.log("Creating product with values:", values);
      
      const processedVariations = values.variations.map(v => ({
        name: v.name,
        options: v.options.split(',').map(o => o.trim()),
      }));

      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: values.name,
            description: values.description || null,
            price: parseFloat(values.price),
            sku: values.sku,
            variations: processedVariations,
            stock: values.stock || {},
            active: true,
          },
        ])
        .select();

      if (error) {
        console.error("Error creating product:", error);
        if (error.code === '23505') {
          throw new Error("SKU já está em uso.");
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Produto criado",
        description: "O produto foi criado com sucesso.",
      });
      navigate("/admin/products");
    },
    onError: (error: Error) => {
      console.error("Error in mutation:", error);
      toast({
        title: "Erro ao criar produto",
        description: error.message || "Ocorreu um erro ao criar o produto.",
        variant: "destructive",
      });
    },
  });

  const addVariation = () => {
    const currentVariations = form.getValues("variations");
    const newVariation: ProductVariation = {
      name: "",
      options: "",
    };
    form.setValue("variations", [...currentVariations, newVariation]);
  };

  const removeVariation = (index: number) => {
    const currentVariations = form.getValues("variations");
    form.setValue(
      "variations", 
      currentVariations.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (values: ProductFormValues) => {
    console.log("Form submitted with values:", values);
    try {
      await createProduct.mutateAsync(values);
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  if (isCheckingAuth) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/products")}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Novo Produto</h1>
            <p className="text-muted-foreground">
              Adicione um novo produto ao catálogo
            </p>
          </div>
        </div>
      </div>

      <Card className="border-2 border-muted shadow-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle>Informações do Produto</CardTitle>
          </div>
          <CardDescription>
            Preencha as informações do novo produto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Nome do Produto
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-background" placeholder="0.00" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>Variações</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addVariation}
                      className="hover:bg-primary hover:text-white transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Variação
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {form.watch("variations").map((_, index) => (
                      <VariationField
                        key={index}
                        form={form}
                        index={index}
                        onRemove={() => removeVariation(index)}
                      />
                    ))}
                  </div>

                  <StockMatrix
                    form={form}
                    variations={form.watch("variations")}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full hover:bg-primary/90 transition-colors"
              >
                <Package className="h-4 w-4 mr-2" />
                Criar Produto
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProduct;