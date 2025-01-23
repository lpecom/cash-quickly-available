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
import { Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductFormValues, productSchema, ProductVariation } from "@/types/product";
import { CreateProductHeader } from "@/components/admin/products/CreateProductHeader";
import { BasicProductInfo } from "@/components/admin/products/BasicProductInfo";
import { ProductVariations } from "@/components/admin/products/ProductVariations";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [session, setSession] = useState(null);

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
        setSession(session);
        
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const createProduct = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

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
    <div className="space-y-6 max-w-3xl mx-auto p-4 md:p-6">
      <CreateProductHeader />

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