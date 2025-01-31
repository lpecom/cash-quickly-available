import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MapPin, Timer, Truck, ShoppingBag, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

type PaymentMethod = "cash" | "card";

export default function Checkout() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [shippingMethod, setShippingMethod] = useState<"free" | "express">("free");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) throw new Error("ID do produto é obrigatório");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Erro ao buscar produto:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Produto não encontrado");
      }

      return data as Product;
    },
    retry: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      if (!product) {
        toast.error("Informações do produto não disponíveis");
        return;
      }

      const shippingCost = shippingMethod === "express" ? 3.99 : 0;
      const total = product.price + shippingCost;

      console.log('Creating order with data:', {
        customerName: formData.fullName,
        address: `${formData.address}, ${formData.landmark}, ${formData.city}, ${formData.state} ${formData.pincode}`,
        phone: formData.phone,
        total
      });

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: formData.fullName,
          address: `${formData.address}, ${formData.landmark}, ${formData.city}, ${formData.state} ${formData.pincode}`,
          phone: formData.phone,
          status: 'pending',
          total: total,
          delivery_instructions: formData.landmark || null,
        }])
        .select()
        .single();

      if (orderError) {
        console.error('Erro ao criar pedido:', orderError);
        throw orderError;
      }

      console.log('Order created:', order);

      // Create order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert([{
          order_id: order.id,
          product_id: productId,
          quantity: 1,
          price_at_time: product.price,
        }]);

      if (itemError) {
        console.error('Erro ao criar item do pedido:', itemError);
        throw itemError;
      }

      console.log('Order item created successfully');
      
      navigate(`/success?orderId=${order.id}`);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast.error("Falha ao criar pedido. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-orange-300 p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md animate-pulse">
          <CardContent className="p-8">
            <div className="h-8 bg-gray-200 rounded mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8" />
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-orange-300 p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-500">Produto não encontrado</p>
            <Button className="mt-4" onClick={() => navigate("/")}>
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const shippingCost = shippingMethod === "express" ? 3.99 : 0;
  const totalCost = (product.price + shippingCost).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-orange-300">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <ShoppingBag className="h-8 w-8" />
            Finalizar Compra
          </h1>
          <p className="text-white/80">Complete sua compra de forma segura</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/95 backdrop-blur order-2 md:order-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Informações de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Digite seu nome completo"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Digite seu telefone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Rua, número"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landmark">Ponto de Referência</Label>
                  <Input
                    id="landmark"
                    name="landmark"
                    placeholder="Ex: Próximo ao mercado"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Cidade"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="Estado"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">CEP *</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    placeholder="CEP"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    className="bg-white"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processando..." : `Finalizar Pedido - R$ ${totalCost}`}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur md:sticky md:top-8">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  <p className="text-lg font-semibold mt-2">R$ {product.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <RadioGroup
                  defaultValue={shippingMethod}
                  onValueChange={(value) => setShippingMethod(value as "free" | "express")}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="free" id="free" />
                    <Label htmlFor="free" className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Entrega padrão</p>
                        <p className="text-sm text-muted-foreground">3-5 dias úteis</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Entrega expressa</p>
                        <p className="text-sm text-muted-foreground">1-2 dias úteis</p>
                        <p className="text-sm font-medium text-primary">+ R$ 3,99</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="border-t pt-4">
                <RadioGroup
                  defaultValue={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Pagamento na entrega</p>
                        <p className="text-sm text-muted-foreground">Pague em dinheiro ao receber</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>R$ {product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Frete</span>
                  <span>{shippingMethod === "express" ? "R$ 3,99" : "Grátis"}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>R$ {totalCost}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}