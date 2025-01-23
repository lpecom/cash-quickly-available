import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-orange-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p>Thank you for your order.</p>
            {orderId && (
              <p className="mt-2">
                Order ID: <span className="font-mono">{orderId.slice(0, 8)}</span>
              </p>
            )}
            <p className="mt-2">We'll start preparing your order right away.</p>
          </div>
          <Button asChild className="w-full">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}