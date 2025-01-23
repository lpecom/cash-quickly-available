import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Sistema de Entregas
          </h1>
          <p className="text-gray-400">
            Escolha como deseja acessar o sistema
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="hover:border-primary transition-colors cursor-pointer h-full"
            onClick={() => navigate("/auth/motoboy")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary" />
                Área do Entregador
              </CardTitle>
              <CardDescription>
                Acesse suas entregas, histórico e pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Visualize entregas disponíveis</li>
                <li>• Gerencie suas entregas</li>
                <li>• Acompanhe seus ganhos</li>
                <li>• Acesse seu histórico</li>
              </ul>
            </CardContent>
          </Card>

          <Card 
            className="hover:border-primary transition-colors cursor-pointer h-full"
            onClick={() => navigate("/auth/admin")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Área Administrativa
              </CardTitle>
              <CardDescription>
                Gerencie pedidos, entregadores e configurações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Gerencie pedidos</li>
                <li>• Controle de entregadores</li>
                <li>• Relatórios financeiros</li>
                <li>• Configurações do sistema</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}