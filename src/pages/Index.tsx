import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bike, Building2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleSelection = (role: 'motoboy' | 'admin') => {
    navigate('/auth', { state: { role } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Bem-vindo ao Cash Quickly
          </h1>
          <p className="text-xl text-muted-foreground">
            Escolha como deseja acessar a plataforma
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bike className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Área do Entregador</CardTitle>
              <CardDescription>
                Acesse sua conta para gerenciar entregas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                onClick={() => handleSelection('motoboy')}
              >
                Entrar como Entregador
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Área Administrativa</CardTitle>
              <CardDescription>
                Gerencie pedidos, produtos e entregadores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                onClick={() => handleSelection('admin')}
              >
                Entrar como Administrador
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;