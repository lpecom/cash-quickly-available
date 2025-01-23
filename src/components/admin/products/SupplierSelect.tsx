import { useQuery } from "@tanstack/react-query";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { ProductFormValues } from "@/types/product";

interface SupplierSelectProps {
  form: UseFormReturn<ProductFormValues>;
}

export const SupplierSelect = ({ form }: SupplierSelectProps) => {
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("active", true)
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="supplier_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Fornecedor</FormLabel>
          <Select
            disabled={isLoading}
            onValueChange={field.onChange}
            value={field.value || ""}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um fornecedor" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {suppliers?.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};