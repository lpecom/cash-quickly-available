import React, { useMemo } from "react";
import { Package, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrderFilters } from "@/components/admin/orders/OrderFilters";

const SellerCatalog = () => {
  const queryClient = useQueryClient();

  const { data: suppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("id, name")
        .eq("active", true);

      if (error) throw error;
      return data;
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["catalog-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          description,
          price,
          supplier:supplier_id (
            id,
            name
          ),
          created_at
        `)
        .is("seller_id", null)
        .eq("active", true);

      if (error) {
        toast.error("Erro ao carregar produtos");
        throw error;
      }

      return data;
    },
  });

  // Extract unique categories from product descriptions
  const categories = useMemo(() => {
    if (!products) return [];
    const categorySet = new Set<string>();
    products.forEach(product => {
      if (product.description) {
        // This is a simple example - you might want to implement a more sophisticated
        // category extraction logic based on your data
        const words = product.description.split(' ');
        words.forEach(word => {
          if (word.length > 3) categorySet.add(word);
        });
      }
    });
    return Array.from(categorySet);
  }, [products]);

  // Find the maximum price for the price range slider
  const maxPrice = useMemo(() => {
    if (!products?.length) return 1000;
    return Math.ceil(Math.max(...products.map(p => p.price)));
  }, [products]);

  const [filters, setFilters] = React.useState({
    search: "",
    supplier: "all",
    category: "all",
    priceRange: [0, maxPrice] as [number, number],
    sortBy: "name_asc"
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products
      .filter(product => {
        const matchesSearch = !filters.search || 
          product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.description?.toLowerCase().includes(filters.search.toLowerCase());
        
        const matchesSupplier = filters.supplier === "all" || 
          product.supplier?.id === filters.supplier;
        
        const matchesPrice = product.price >= filters.priceRange[0] && 
          product.price <= filters.priceRange[1];
        
        const matchesCategory = filters.category === "all" || 
          product.description?.toLowerCase().includes(filters.category.toLowerCase());

        return matchesSearch && matchesSupplier && matchesPrice && matchesCategory;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          case "price_asc":
            return a.price - b.price;
          case "price_desc":
            return b.price - a.price;
          case "newest":
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          default:
            return 0;
        }
      });
  }, [products, filters]);

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Catálogo</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Package className="h-12 w-12 text-muted-foreground animate-pulse" />
            <p className="text-muted-foreground text-center mt-4">
              Carregando produtos...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Catálogo</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} produtos disponíveis
        </p>
      </div>

      <OrderFilters
        onFiltersChange={handleFiltersChange}
        suppliers={suppliers}
        categories={categories}
        maxPrice={maxPrice}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[4/3] bg-muted rounded-t-lg flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-1">
                Fornecedor: {product.supplier?.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-primary">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.price)}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhum produto encontrado com os filtros selecionados.
              <br />
              Tente ajustar os filtros para ver mais produtos.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SellerCatalog;