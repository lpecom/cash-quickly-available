import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, DollarSign, Package, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data - replace with real data later
const drivers = [
  {
    id: "1",
    name: "João Silva",
    phone: "(11) 98765-4321",
    totalDeliveries: 156,
    successRate: 94,
    totalEarnings: 2890.5,
  },
  {
    id: "2",
    name: "Maria Santos",
    phone: "(11) 91234-5678",
    totalDeliveries: 98,
    successRate: 96,
    totalEarnings: 1750.75,
  },
];

const AdminDriversList = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Motoristas</h1>
          <p className="text-muted-foreground">
            Lista de entregadores cadastrados
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {drivers.map((driver) => (
          <Card key={driver.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-start space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <Link
                      to={`/admin/drivers/${driver.id}`}
                      className="font-semibold hover:text-primary"
                    >
                      {driver.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {driver.phone}
                    </p>
                  </div>
                </div>
                <div className="grid w-full grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">Entregas</span>
                    <span className="font-semibold">{driver.totalDeliveries}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">Sucesso</span>
                    <span className="font-semibold">{driver.successRate}%</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">Ganhos</span>
                    <span className="font-semibold">
                      R$ {driver.totalEarnings.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDriversList;