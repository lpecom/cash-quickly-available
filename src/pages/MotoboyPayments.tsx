import { Badge } from "@/components/ui/badge";
import { DollarSign, ChevronRight, CheckCircle2, XCircle, ArrowUp, CreditCard } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const payments = [
  {
    id: "1",
    orderId: "#1234",
    amount: 15.00,
    date: "20/02",
    status: "paid",
    delivered: true,
    type: "order"
  },
  {
    id: "2",
    orderId: "#1235",
    amount: 12.00,
    date: "20/02",
    status: "pending",
    delivered: false,
    type: "order"
  },
  {
    id: "3",
    orderId: null,
    amount: 5.00,
    date: "20/02",
    status: "paid",
    delivered: null,
    type: "saida"
  }
];

const MotoboyPayments = () => {
  const calculateTotalAmount = () => {
    return payments.reduce((total, payment) => {
      if (payment.type === "saida") return total + payment.amount; // Changed from subtraction to addition
      const adjustedAmount = payment.delivered ? payment.amount : payment.amount / 2;
      return total + adjustedAmount;
    }, 0);
  };

  const calculateTodayGains = () => {
    const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return payments
      .filter(payment => payment.date === today)
      .reduce((total, payment) => {
        if (payment.type === "saida") return total + payment.amount; // Changed from subtraction to addition
        const adjustedAmount = payment.delivered ? payment.amount : payment.amount / 2;
        return total + adjustedAmount;
      }, 0);
  };

  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toFixed(2)}`;
  };

  const handleWithdrawRequest = () => {
    toast.success("Solicitação de saque enviada com sucesso!");
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

        <div className="bg-card rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-semibold">Ganhos de hoje</h2>
              <p className="text-2xl font-bold text-primary">{formatCurrency(calculateTodayGains())}</p>
            </div>
            <Button onClick={handleWithdrawRequest} variant="outline" className="gap-2">
              <ArrowUp className="w-4 h-4" />
              Solicitar saque
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-4">
            {payments.map((payment) => (
              <Link
                key={payment.id}
                to={payment.orderId ? `/order/${payment.orderId.replace("#", "")}` : "#"}
                className={`block bg-card rounded-lg shadow-sm p-4 ${!payment.orderId ? 'cursor-default' : ''}`}
                onClick={(e) => !payment.orderId && e.preventDefault()}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {payment.type === "saida" ? (
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-primary" />
                          <span>Saída</span>
                        </div>
                      ) : (
                        `Pedido ${payment.orderId}`
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end gap-1">
                      {payment.type === "order" ? (
                        <>
                          <div className="flex items-center gap-2">
                            {payment.delivered ? (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-0 flex items-center gap-1">
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
                        </>
                      ) : (
                        <span className="font-medium text-primary">
                          {formatCurrency(payment.amount)}
                        </span>
                      )}
                    </div>
                    {payment.type === "order" && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
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