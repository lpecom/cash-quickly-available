import { DriverMetrics } from "@/components/admin/drivers/DriverMetrics";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Clock } from "lucide-react";

const mockDailyData = [
  { hour: "09:00", earnings: 45 },
  { hour: "10:00", earnings: 30 },
  { hour: "11:00", earnings: 60 },
  { hour: "12:00", earnings: 85 },
  { hour: "13:00", earnings: 70 },
  { hour: "14:00", earnings: 45 },
];

const MotoboyDashboardStats = () => {
  // In a real app, these would come from an API
  const dailyStats = {
    totalDeliveries: 8,
    successRate: 95,
    totalEarnings: 290.50,
    completionRate: 98,
  };

  const goalProgress = 85; // Percentage towards daily goal

  return (
    <div className="min-h-screen bg-secondary p-4 pb-20">
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe suas métricas
          </p>
        </div>

        <DriverMetrics
          totalDeliveries={dailyStats.totalDeliveries}
          successRate={dailyStats.successRate}
          totalEarnings={dailyStats.totalEarnings}
          completionRate={dailyStats.completionRate}
        />

        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Meta Diária</h3>
              <span className="text-sm text-muted-foreground">
                R$ {dailyStats.totalEarnings} / R$ 350,00
              </span>
            </div>
            <Progress value={goalProgress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {goalProgress}% da meta atingida
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium">Ganhos por Hora</h3>
            </div>
            <div className="h-[200px] w-full">
              <ChartContainer
                className="h-full"
                config={{
                  earnings: {
                    theme: {
                      light: "#22C55E",
                      dark: "#22C55E",
                    },
                  },
                }}
              >
                <BarChart data={mockDailyData}>
                  <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(value) => `R$ ${value}`}
                  />
                  <Bar
                    dataKey="earnings"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                  />
                  <ChartTooltip />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MotoboyDashboardStats;