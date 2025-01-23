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

export const CreateOrder = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Array<{ productId: string; quantity: number }>>([]);

  // Fetch available products
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

  const handleAddProduct = (productId: string, quantity: number) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.productId === productId);
      if (existing) {
        return prev.map(p => 
          p.productId === productId ? { ...p, quantity } : p
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const handleCreateOrder = async () => {
    try {
      if (!customerName || !address || !phone) {
        toast.error("Please fill in all required fields");
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
          total: 0, // Will be calculated by trigger
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = selectedProducts.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_time: products?.find(p => p.id === item.productId)?.price || 0,
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
              <label className="text-sm font-medium">Name</label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Delivery address"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
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
            {products?.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-2 border rounded">
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {product.price.toFixed(2)}
                  </p>
                </div>
                <Input
                  type="number"
                  className="w-20"
                  min="0"
                  value={selectedProducts.find(p => p.productId === product.id)?.quantity || 0}
                  onChange={(e) => handleAddProduct(product.id, parseInt(e.target.value) || 0)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/orders')}>
          Cancel
        </Button>
        <Button onClick={handleCreateOrder}>
          Create Order
        </Button>
      </div>
    </div>
  );
};

export default CreateOrder;