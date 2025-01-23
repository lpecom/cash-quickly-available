import { Order } from "@/types/order";
import { format } from "date-fns";
import { OrderMap } from "./OrderMap";
import { OrderTimeline } from "./OrderTimeline";
import { OrderCustomerInfo } from "./OrderCustomerInfo";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

interface OrderDetailsPanelProps {
  order: Order | null;
}

export const OrderDetailsPanel = ({ order }: OrderDetailsPanelProps) => {
  if (!order) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select an order to view details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">Order ID #{order.id.slice(0, 8)}</h2>
            <button 
              onClick={() => navigator.clipboard.writeText(order.id)}
              className="text-primary hover:text-primary/80"
            >
              📋
            </button>
          </div>
          <p className="text-muted-foreground">
            {format(new Date(order.created_at), "h:mma")} · Today
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            <OrderCustomerInfo order={order} />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Order Tracking</h3>
            <OrderMap address={order.address} />
            <div className="mt-4">
              <OrderTimeline events={[]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};