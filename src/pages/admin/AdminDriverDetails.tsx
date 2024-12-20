import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, DollarSign, Package, CheckCircle } from "lucide-react";
import { DeliveryHistory } from "@/components/admin/drivers/DeliveryHistory";

// Mock data - replace with real data later
const mockDriver = {
  id: "1",
  name: "João Silva",
  phone: "(11) 98765-4321",
  email: "joao.silva@email.com",
  totalDeliveries: 156,
  successRate: 94,
  totalEarnings: 2890.5,
  completionRate: 92,
};

const mockDeliveries = [
  {
    id: "1",
    orderId: "ORD001",
    date: new Date(),
    customer: "Cliente 1",
    amount: 150.0,
    status: "completed" as const,
    commission: 15.0,
  },
  {
    id: "2",
    orderId: "ORD002",
    date: new Date(Date.now() - 86400000),
    customer: "Cliente 2",
    amount: 89.9,
    status: "failed" as const,
    commission: 8.99,
  },
];

const AdminDriverDetails = () => {
  const { driverId } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{mockDriver.name}</h1>
        <p className="text-muted-foreground">Detalhes do entregador</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entregas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDriver.totalDeliveries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDriver.successRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ganhos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {mockDriver.totalEarnings.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conclusão
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDriver.completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{mockDriver.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium">{mockDriver.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{mockDriver.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Histórico de Entregas</h2>
        <DeliveryHistory deliveries={mockDeliveries} />
      </div>
    </div>
  );
};

export default AdminDriverDetails;