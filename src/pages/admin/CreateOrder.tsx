import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/order";
import { Plus, Minus, Save } from "lucide-react";

interface SelectedProduct {
  productId: string;
  quantity: number;
}

interface ProductWithQuantity extends Product {
  quantity: number;
}

export const CreateOrder = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<ProductWithQuantity[]>([]);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true);

      if (error) {
        toast.error('Error loading products');
        throw error;
      }

      return data as Product[];
    },
  });

  const handleAddProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => 
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(p => 
          p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
        );
      }
      return prev.filter(p => p.id !== productId);
    });
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleCreateOrder = async () => {
    try {
      if (!customerName || !address || !phone) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (selectedProducts.length === 0) {
        toast.error("Please add at least one product");
        return;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: customerName,
          address,
          phone,
          delivery_instructions: deliveryInstructions,
          status: 'pending',
          total: calculateTotal(),
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = selectedProducts.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast.success("Order created successfully");
      navigate(`/admin/orders/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Failed to create order");
    }
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Order</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Address *</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Delivery address"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone *</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Delivery Instructions</label>
              <Textarea
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="Special instructions for delivery"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {products?.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-2 border rounded">
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      R$ {product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">
                      {selectedProducts.find(p => p.id === product.id)?.quantity || 0}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleAddProduct(product)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold">
                  R$ {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/orders')}>
          Cancel
        </Button>
        <Button onClick={handleCreateOrder}>
          <Save className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>
    </div>
  );
};

export default CreateOrder;