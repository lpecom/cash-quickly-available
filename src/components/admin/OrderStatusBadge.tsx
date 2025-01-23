import { Badge } from "@/components/ui/badge";
import { Order, orderStatusMap } from "@/types/order";
import { CheckCircle2, Clock, Truck, XCircle, Package } from "lucide-react";

interface OrderStatusBadgeProps {
  status: Order['status'];
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500 hover:bg-green-600';
      case 'on_route':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'delivered':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'not_delivered':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-yellow-500 hover:bg-yellow-600';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'on_route':
        return <Truck className="w-3 h-3" />;
      case 'delivered':
        return <Package className="w-3 h-3" />;
      case 'not_delivered':
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} flex items-center gap-1`}>
      {getStatusIcon(status)}
      <span>{orderStatusMap[status]}</span>
    </Badge>
  );
};