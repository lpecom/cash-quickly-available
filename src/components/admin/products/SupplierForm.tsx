import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const SupplierForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('suppliers')
        .insert([{ name, email, phone, address }]);

      if (error) throw error;

      toast.success("Fornecedor criado com sucesso");
      navigate("/admin/products/suppliers");
    } catch (error) {
      console.error('Error creating supplier:', error);
      toast.error("Erro ao criar fornecedor");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Fornecedor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do fornecedor"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email *</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email do fornecedor"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Telefone</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Telefone do fornecedor"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Endereço</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Endereço do fornecedor"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate('/admin/products/suppliers')}>
          Cancelar
        </Button>
        <Button type="submit">
          Criar Fornecedor
        </Button>
      </div>
    </form>
  );
};