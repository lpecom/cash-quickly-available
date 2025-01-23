import { Button } from "@/components/ui/button";
import { Eye, Truck, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface OrderActionsProps {
  orderId: string;
  status: string;
  onCallDriver: (orderId: string) => void;
  isLoading: boolean;
}

export const OrderActions = ({ orderId, status, onCallDriver, isLoading }: OrderActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link to={`/admin/orders/${orderId}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      {status === 'pending' && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onCallDriver(orderId)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Truck className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};