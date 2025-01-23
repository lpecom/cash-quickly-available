import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
import { ArrowLeft, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductFormValues, ProductVariation, productSchema } from "@/types/product";
import { CreateProductHeader } from "@/components/admin/products/CreateProductHeader";
import { BasicProductInfo } from "@/components/admin/products/BasicProductInfo";
import { ProductVariations } from "@/components/admin/products/ProductVariations";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const queryClient = useQueryClient();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      price: "",
      variations: [] as ProductVariation[],
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

        if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para criar produtos.",
            variant: "destructive",
          });
          navigate("/admin/products");
          return;
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const processedVariations = values.variations.map(v => ({
        name: v.name,
        options: v.options.split(',').map(o => o.trim()),
      }));

      const productData = {
        name: values.name,
        description: values.description || null,
        price: parseFloat(values.price),
        sku: values.sku,
        variations: processedVariations,
        stock: values.stock || {},
        active: true,
      };

      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select()
        .single();

      if (error) {
        console.error("Error creating product:", error);
        throw error;
      }

      console.log("Product created successfully:", data);
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
    form.setValue("variations", [...currentVariations, { name: "", options: "" }]);
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
    <div className="container mx-auto p-4 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/products">Produtos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Criar Produto</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        <Package className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Criar Produto</h1>
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
              <BasicProductInfo form={form} />
              
              <ProductVariations
                form={form}
                onAddVariation={addVariation}
                onRemoveVariation={removeVariation}
              />

              <Button 
                type="submit" 
                className="w-full hover:bg-primary/90 transition-colors"
                disabled={createProduct.isPending}
              >
                <Package className="h-4 w-4 mr-2" />
                {createProduct.isPending ? "Criando..." : "Criar Produto"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProduct;