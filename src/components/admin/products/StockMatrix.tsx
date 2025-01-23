import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { ProductFormValues, ProductVariation } from "@/types/product";

interface StockMatrixProps {
  form: UseFormReturn<ProductFormValues>;
  variations: ProductVariation[];
}

export const StockMatrix = ({ form, variations }: StockMatrixProps) => {
  if (!variations.length) return null;

  const generateCombinations = (variations: ProductVariation[]) => {
    const options = variations.map(v => v.options.split(',').map(o => o.trim()));
    const combinations = options.reduce((acc, curr) => {
      if (!acc.length) return curr.map(item => [item]);
      return acc.flatMap(prev => curr.map(item => [...prev, item]));
    }, [] as string[][]);

    return combinations.map(combo => ({
      key: combo.join('-'),
      values: combo,
    }));
  };

  const combinations = generateCombinations(variations);

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <FormLabel>Estoque por Variação</FormLabel>
        <div className="grid gap-4 mt-2">
          {combinations.map(({ key, values }) => (
            <FormField
              key={key}
              control={form.control}
              name={`stock.${key}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      {variations.map((v, i) => (
                        <span key={v.name}>
                          {v.name}: {values[i]}
                          {i < variations.length - 1 ? ' / ' : ''}
                        </span>
                      ))}
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        className="w-32"
                        placeholder="0"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};