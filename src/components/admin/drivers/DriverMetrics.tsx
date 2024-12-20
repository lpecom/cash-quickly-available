import { MetricCard } from "@/components/MetricCard";
import { TrendingUp, Package, DollarSign, Percent } from "lucide-react";

interface DriverMetricsProps {
  totalDeliveries: number;
  successRate: number;
  totalEarnings: number;
  completionRate: number;
}

export function DriverMetrics({
  totalDeliveries,
  successRate,
  totalEarnings,
  completionRate,
}: DriverMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total de Entregas"
        value={totalDeliveries.toString()}
        icon={Package}
        trend={{
          value: 12,
          isPositive: true,
        }}
      />
      <MetricCard
        title="Taxa de Sucesso"
        value={`${successRate}%`}
        icon={TrendingUp}
        trend={{
          value: 4,
          isPositive: true,
        }}
      />
      <MetricCard
        title="Ganhos Totais"
        value={`R$ ${totalEarnings.toFixed(2)}`}
        icon={DollarSign}
        trend={{
          value: 8,
          isPositive: true,
        }}
      />
      <MetricCard
        title="Taxa de Conclusão"
        value={`${completionRate}%`}
        icon={Percent}
        trend={{
          value: 2,
          isPositive: false,
        }}
      />
    </div>
  );
}