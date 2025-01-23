import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, ShoppingCart, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface CheckoutLinkGeneratorProps {
  productId: string;
  productName: string;
}

export const CheckoutLinkGenerator = ({ productId, productName }: CheckoutLinkGeneratorProps) => {
  const [checkoutLink, setCheckoutLink] = useState('');

  const generateCheckoutLink = () => {
    // Update the path to match the route we defined in App.tsx
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/produto/${productId}/checkout`;
    setCheckoutLink(link);
    
    toast.success("Link gerado com sucesso!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(checkoutLink);
    toast.success("Link copiado!");
  };

  const openPreview = () => {
    window.open(checkoutLink, '_blank');
  };

  return (
    <Card className="border-2 border-muted shadow-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <CardTitle>Link de Checkout</CardTitle>
        </div>
        <CardDescription>
          Gere um link de checkout para {productName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          {checkoutLink ? (
            <>
              <div className="flex gap-2">
                <Input 
                  value={checkoutLink} 
                  readOnly 
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  title="Copiar link"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={openPreview}
                  title="Abrir preview"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <Button 
              onClick={generateCheckoutLink}
              className="w-full"
            >
              <Link className="h-4 w-4 mr-2" />
              Gerar Link de Checkout
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};