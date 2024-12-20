import { Badge } from "@/components/ui/badge";
import { DollarSign, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

const payments = [
  {
    id: "1",
    orderId: "#1234",
    amount: 15.00,
    date: "20/02",
    status: "paid",
    delivered: true,
  },
  {
    id: "2",
    orderId: "#1235",
    amount: 12.00,
    date: "20/02",
    status: "pending",
    delivered: false,
  },
];

const MotoboyPayments = () => {
  const calculateTotalAmount = () => {
    return payments.reduce((total, payment) => {
      const adjustedAmount = payment.delivered ? payment.amount : payment.amount / 2;
      return total + adjustedAmount;
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toFixed(2)}`;
  };

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
            {formatCurrency(calculateTotalAmount())}
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
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        {payment.delivered ? (
                          <Badge variant="success" className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Entregue
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Não entregue
                          </Badge>
                        )}
                      </div>
                      <span className="font-medium">
                        {formatCurrency(payment.delivered ? payment.amount : payment.amount / 2)}
                      </span>
                    </div>
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