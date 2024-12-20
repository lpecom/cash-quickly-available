import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MotoboyDashboard from "./pages/MotoboyDashboard";
import MotoboyPayments from "./pages/MotoboyPayments";
import MotoboySales from "./pages/MotoboySales";
import OrderDetails from "./pages/OrderDetails";
import MobileNav from "./components/MobileNav";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDrivers from "./pages/admin/AdminDrivers";
import AdminLayout from "./layouts/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/motoboy" element={<MotoboyDashboard />} />
          <Route path="/motoboy/payments" element={<MotoboyPayments />} />
          <Route path="/motoboy/sales" element={<MotoboySales />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="drivers" element={<AdminDrivers />} />
          </Route>
        </Routes>
        <MobileNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;