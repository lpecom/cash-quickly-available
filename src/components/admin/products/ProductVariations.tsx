import React from 'react';
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "@/types/product";
import { VariationField } from "./VariationField";
import { StockMatrix } from "./StockMatrix";

interface ProductVariationsProps {
  form: UseFormReturn<ProductFormValues>;
  onAddVariation: () => void;
  onRemoveVariation: (index: number) => void;
}

export const ProductVariations = ({ form, onAddVariation, onRemoveVariation }: ProductVariationsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel>Variações</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddVariation}
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
            onRemove={() => onRemoveVariation(index)}
          />
        ))}
      </div>

      <StockMatrix
        form={form}
        variations={form.watch("variations")}
      />
    </div>
  );
};