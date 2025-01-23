import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LogOut, User, Phone, Save } from "lucide-react";
import { toast } from "sonner";
import MobileNav from "@/components/MobileNav";
import { ProfileTierCard } from "@/components/ProfileTierCard";

const MotoboyProfile = () => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.user.id)
        .single();

      if (error) throw error;

      setFullName(data.full_name || "");
      setPhone(data.phone || "");

      return data;
    }
  });

  const { data: metrics } = useQuery({
    queryKey: ["driver_metrics"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not found");

      const { data, error } = await supabase
        .rpc('get_driver_metrics', {
          driver_uuid: user.user.id
        });

      if (error) throw error;
      return data[0];
    }
  });

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not found");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone,
        })
        .eq("id", user.user.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Erro ao sair");
    }
  };

  return (
    <div className="min-h-screen bg-secondary pb-16">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais
          </p>
        </div>

        {metrics && (
          <div className="mb-6">
            <ProfileTierCard totalDeliveries={metrics.total_deliveries} />
          </div>
        )}

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Nome completo
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefone
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Seu telefone"
              />
            </div>

            <Button
              className="w-full"
              onClick={handleUpdateProfile}
              disabled={isUpdating}
            >
              {isUpdating ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar alterações
                </>
              )}
            </Button>
          </div>
        </Card>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
      <MobileNav />
    </div>
  );
};

export default MotoboyProfile;