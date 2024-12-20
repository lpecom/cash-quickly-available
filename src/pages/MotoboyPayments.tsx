import { Badge } from "@/components/ui/badge";
import { DollarSign, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

const payments = [
  {
    id: "1",
    orderId: "#1234",
    amount: "R$ 15,00",
    date: "20/02",
    status: "paid",
  },
  {
    id: "2",
    orderId: "#1235",
    amount: "R$ 12,00",
    date: "20/02",
    status: "pending",
  },
];

const MotoboyPayments = () => {
  return (
    <div className="min-h-screen bg-secondary p-4 pb-20">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Pagamentos</h1>
            <p className="text-sm text-muted-foreground">Seus ganhos</p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <DollarSign className="w-4 h-4 mr-1" />
            R$ 27,00
          </Badge>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-4">
            {payments.map((payment) => (
              <Link
                key={payment.id}
                to={`/order/${payment.orderId.replace("#", "")}`}
                className="block bg-card rounded-lg shadow-sm p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Pedido {payment.orderId}</h3>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{payment.amount}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MotoboyPayments;