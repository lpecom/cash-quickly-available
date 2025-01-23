import { Card } from "@/components/ui/card";
import { Award, Star, Crown, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TierInfo {
  name: string;
  icon: JSX.Element;
  minDeliveries: number;
  commission: number;
}

const tiers: TierInfo[] = [
  { name: "Iniciante", icon: <Star className="w-5 h-5" />, minDeliveries: 0, commission: 10 },
  { name: "Prata", icon: <Award className="w-5 h-5" />, minDeliveries: 50, commission: 12 },
  { name: "Ouro", icon: <Crown className="w-5 h-5" />, minDeliveries: 100, commission: 15 },
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
              <p className="text-sm text-muted-foreground">
                Comissão atual: {currentTier.commission}%
              </p>
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
                +{nextTier.commission - currentTier.commission}% comissão
                <ChevronRight className="w-4 h-4 inline ml-1" />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}