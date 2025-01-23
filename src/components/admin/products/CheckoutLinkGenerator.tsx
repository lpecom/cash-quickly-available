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
import { useToast } from "@/hooks/use-toast";

interface CheckoutLinkGeneratorProps {
  productId: string;
  productName: string;
}

export const CheckoutLinkGenerator = ({ productId, productName }: CheckoutLinkGeneratorProps) => {
  const { toast } = useToast();
  const [checkoutLink, setCheckoutLink] = useState('');

  const generateCheckoutLink = () => {
    // This is a placeholder URL - replace with your actual Shopify store URL
    const baseUrl = 'https://your-store.myshopify.com/cart';
    const variantId = productId; // You might need to map this to Shopify variant ID
    const link = `${baseUrl}/${variantId}?checkout[email]=&checkout[shipping_address][first_name]=`;
    setCheckoutLink(link);
    
    toast({
      title: "Link generated",
      description: "Checkout link has been generated successfully.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(checkoutLink);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard.",
    });
  };

  const openPreview = () => {
    window.open(checkoutLink, '_blank');
  };

  return (
    <Card className="border-2 border-muted shadow-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <CardTitle>Checkout Link</CardTitle>
        </div>
        <CardDescription>
          Generate a checkout link for {productName}
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
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={openPreview}
                  title="Open preview"
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
              Generate Checkout Link
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};