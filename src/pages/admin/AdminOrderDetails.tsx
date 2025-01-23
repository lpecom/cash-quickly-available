import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save } from "lucide-react";
import { Order, Product, orderStatusMap } from "@/types/order";
import { OrderTimeline } from "@/components/admin/OrderTimeline";
import { OrderCustomerInfo } from "@/components/admin/OrderCustomerInfo";
import { OrderProductList } from "@/components/admin/OrderProductList";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Order["status"]>("pending");

  const isNewOrder = orderId === 'new';

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      // Don't fetch if we're creating a new order
      if (isNewOrder) {
        return null;
      }

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            product:products(*)
          )
        `)
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      return orderData as Order;
    },
    enabled: !isNewOrder, // Only run query if we're not creating a new order
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true);

      if (error) throw error;
      return data as Product[];
    },
  });

  if (isLoading && !isNewOrder) {
    return <div>Loading...</div>;
  }

  const handleAddProduct = async () => {
    if (!selectedProduct || quantity < 1) {
      toast.error("Please select a product and quantity");
      return;
    }

    const product = products?.find(p => p.id === selectedProduct);
    if (!product) return;

    try {
      const { error } = await supabase
        .from('order_items')
        .insert({
          order_id: orderId,
          product_id: selectedProduct,
          quantity: quantity,
          price_at_time: product.price
        });

      if (error) throw error;
      toast.success("Product added to order");
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error("Failed to add product");
    }
  };

  const handleRemoveProduct = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('order_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      toast.success("Product removed from order");
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error("Failed to remove product");
    }
  };

  const handleAddNote = () => {
    if (!note.trim()) {
      toast.error("Digite uma observação");
      return;
    }
    toast.success("Observação adicionada com sucesso");
    setNote("");
  };

  const handleStatusChange = async (newStatus: Order["status"]) => {
    if (isNewOrder) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      setStatus(newStatus);
      toast.success(`Status atualizado para ${orderStatusMap[newStatus]}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Failed to update status");
    }
  };

  const handleSaveChanges = () => {
    toast.success("Alterações salvas com sucesso");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isNewOrder ? "Novo Pedido" : `Pedido #${orderId}`}
          </h1>
          {!isNewOrder && order && (
            <p className="text-muted-foreground">
              Cliente: {order.customer_name}
            </p>
          )}
        </div>
        <Button onClick={handleSaveChanges}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          {!isNewOrder && order && <OrderCustomerInfo order={order} />}

          {!isNewOrder && (
            <Card>
              <CardHeader>
                <CardTitle>Status do Pedido</CardTitle>
                <CardDescription>Atualize o status do pedido</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={status}
                  onValueChange={(value) => handleStatusChange(value as Order["status"])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(orderStatusMap).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Adicionar Produto</CardTitle>
              <CardDescription>Adicione produtos ao pedido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Selecione um produto</option>
                  {products?.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-24"
                />
                <Button onClick={handleAddProduct}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>

          {!isNewOrder && order && (
            <OrderProductList 
              products={order.items || []}
              onRemoveProduct={handleRemoveProduct}
            />
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Observação</CardTitle>
              <CardDescription>Adicione notas e observações ao pedido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Digite sua observação..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Button onClick={handleAddNote} className="w-full">
                Adicionar Observação
              </Button>
            </CardContent>
          </Card>

          {!isNewOrder && (
            <Card>
              <CardHeader>
                <CardTitle>Histórico do Pedido</CardTitle>
                <CardDescription>Acompanhe todas as atualizações</CardDescription>
              </CardHeader>
              <CardContent>
                <OrderTimeline events={[]} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {!isNewOrder && order && (
        <div className="flex justify-end">
          <div className="text-right">
            <p className="text-lg font-semibold">Total do Pedido</p>
            <p className="text-2xl font-bold">R$ {order.total.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderDetails;