import { Card } from "@/components/ui/card";
import { Award, Star, Crown, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TierInfo {
  name: string;
  icon: JSX.Element;
  minDeliveries: number;
  baseRate: number;
  successRate: number;
  refusalRate: number;
}

const tiers: TierInfo[] = [
  { 
    name: "Iniciante", 
    icon: <Star className="w-5 h-5" />, 
    minDeliveries: 0, 
    baseRate: 20,
    successRate: 10,
    refusalRate: 2
  },
  { 
    name: "Prata", 
    icon: <Award className="w-5 h-5" />, 
    minDeliveries: 50, 
    baseRate: 50,
    successRate: 15,
    refusalRate: 5
  },
  { 
    name: "Ouro", 
    icon: <Crown className="w-5 h-5" />, 
    minDeliveries: 100, 
    baseRate: 70,
    successRate: 20,
    refusalRate: 7
  },
];

interface ProfileTierCardProps {
  totalDeliveries: number;
}

export function ProfileTierCard({ totalDeliveries }: ProfileTierCardProps) {
  const getCurrentTier = () => {
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (totalDeliveries >= tiers[i].minDeliveries) {
        return i;
      }
    }
    return 0;
  };

  const currentTierIndex = getCurrentTier();
  const currentTier = tiers[currentTierIndex];
  const nextTier = tiers[currentTierIndex + 1];
  
  const getProgressToNextTier = () => {
    if (!nextTier) return 100;
    const remaining = nextTier.minDeliveries - totalDeliveries;
    const total = nextTier.minDeliveries - currentTier.minDeliveries;
    const progress = ((totalDeliveries - currentTier.minDeliveries) / total) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              {currentTier.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{currentTier.name}</h3>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Saída: {formatCurrency(currentTier.baseRate)}
                </p>
                <p className="text-sm text-green-600">
                  Entrega efetuada: {formatCurrency(currentTier.successRate)}
                </p>
                <p className="text-sm text-red-600">
                  Entrega recusada: {formatCurrency(currentTier.refusalRate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {nextTier && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{totalDeliveries} entregas</span>
              <span>{nextTier.minDeliveries} entregas</span>
            </div>
            <Progress value={getProgressToNextTier()} className="h-2" />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-sm">
                <span>Próximo nível:</span>
                <div className="flex items-center gap-1">
                  {nextTier.icon}
                  <span className="font-medium">{nextTier.name}</span>
                </div>
              </div>
              <div className="text-sm text-primary">
                +{formatCurrency(nextTier.baseRate - currentTier.baseRate)} saída
                <ChevronRight className="w-4 h-4 inline ml-1" />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}