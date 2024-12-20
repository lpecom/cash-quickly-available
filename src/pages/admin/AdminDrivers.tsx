import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DriverMetrics } from "@/components/admin/drivers/DriverMetrics";
import { DeliveryHistory } from "@/components/admin/drivers/DeliveryHistory";

// Mock data - replace with real data later
const mockDeliveries = [
  {
    id: "1",
    orderId: "ORD001",
    date: new Date(),
    customer: "João Silva",
    amount: 150.00,
    status: "completed" as const,
    commission: 15.00,
  },
  {
    id: "2",
    orderId: "ORD002",
    date: new Date(Date.now() - 86400000),
    customer: "Maria Santos",
    amount: 89.90,
    status: "failed" as const,
    commission: 8.99,
  },
  {
    id: "3",
    orderId: "ORD003",
    date: new Date(Date.now() - 172800000),
    customer: "Pedro Oliveira",
    amount: 120.50,
    status: "completed" as const,
    commission: 12.05,
  },
];

const AdminDrivers = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Entregadores</h1>
          <p className="text-muted-foreground">
            Gerencie entregadores e acompanhe métricas
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Entregador
        </Button>
      </div>

      <DriverMetrics
        totalDeliveries={156}
        successRate={94}
        totalEarnings={2890.50}
        completionRate={92}
      />

      <div>
        <h2 className="text-xl font-semibold mb-4">Histórico de Entregas</h2>
        <DeliveryHistory deliveries={mockDeliveries} />
      </div>
    </div>
  );
};

export default AdminDrivers;