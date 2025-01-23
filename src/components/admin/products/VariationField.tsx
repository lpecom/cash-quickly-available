import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface VariationFieldProps {
  form: UseFormReturn<any>;
  index: number;
  onRemove: () => void;
}

export const VariationField = ({ form, index, onRemove }: VariationFieldProps) => {
  return (
    <div className="flex items-end gap-2">
      <FormField
        control={form.control}
        name={`variations.${index}.name`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Nome da Variação</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: Tamanho, Cor" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`variations.${index}.options`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Opções (separadas por vírgula)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="P, M, G" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="mb-2"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
};