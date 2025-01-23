import { useState } from "react";
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
import { ArrowLeft, Box, Tag, Barcode, Warehouse, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const productSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  variations: z.string(),
  sku: z.string().min(3, "SKU deve ter pelo menos 3 caracteres"),
  stock: z.string().regex(/^\d+$/, "Estoque deve ser um número inteiro"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Preço inválido"),
});

type ProductFormValues = z.infer<typeof productSchema>;

const CreateProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is admin on component mount
  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const role = session?.user?.user_metadata?.role;
      
      if (!session || (role !== 'admin' && role !== 'superadmin')) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para criar produtos.",
          variant: "destructive",
        });
        navigate("/admin/products");
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      variations: "",
      sku: "",
      stock: "",
      price: "",
    },
  });

  const createProduct = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const { data, error } = await supabase.from("products").insert([
        {
          name: values.name,
          description: values.variations, // Using description field for variations
          price: parseFloat(values.price),
          sku: values.sku,
          stock: parseInt(values.stock),
          active: true,
        },
      ]);

      if (error) {
        if (error.code === '42501') {
          throw new Error("Você não tem permissão para criar produtos.");
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
      console.error("Error creating product:", error);
      toast({
        title: "Erro ao criar produto",
        description: error.message || "Ocorreu um erro ao criar o produto.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);
    try {
      await createProduct.mutateAsync(values);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/products")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Novo Produto</h1>
          <p className="text-muted-foreground">
            Adicione um novo produto ao catálogo
          </p>
        </div>
      </div>

      <Card className="border-2 border-muted">
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
          <CardDescription>
            Preencha as informações do novo produto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Box className="h-4 w-4" />
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
                name="variations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Variações
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background" placeholder="Ex: Tamanhos, cores, etc" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Barcode className="h-4 w-4" />
                      SKU
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background" placeholder="Código único do produto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Warehouse className="h-4 w-4" />
                      Estoque no Armazém
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" className="bg-background" />
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
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Preço
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background" placeholder="0.00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Criando..."
                ) : (
                  <>
                    <Box className="h-4 w-4 mr-2" />
                    Criar Produto
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProduct;