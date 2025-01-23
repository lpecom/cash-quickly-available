import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDetails from "./pages/OrderDetails";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductDetails from "./pages/admin/AdminProductDetails";
import AdminDrivers from "./pages/admin/AdminDrivers";
import AdminDriverDetails from "./pages/admin/AdminDriverDetails";
import AdminFinance from "./pages/admin/AdminFinance";
import AdminSettings from "./pages/admin/AdminSettings";
import CreateProduct from "./pages/admin/CreateProduct";
import CreateOrder from "./pages/admin/CreateOrder";
import AuthPage from "./pages/auth/AuthPage";
import DriverSignup from "./pages/auth/DriverSignup";
import MotoboyDashboard from "./pages/MotoboyDashboard";
import MotoboyPayments from "./pages/MotoboyPayments";
import MotoboySales from "./pages/MotoboySales";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/driver-signup" element={<DriverSignup />} />
          
          {/* Motoboy Routes */}
          <Route path="/entregas" element={<MotoboyDashboard />} />
          <Route path="/pagamentos" element={<MotoboyPayments />} />
          <Route path="/vendas" element={<MotoboySales />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:orderId" element={<AdminOrderDetails />} />
            <Route path="orders/create" element={<CreateOrder />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/:productId" element={<AdminProductDetails />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="drivers" element={<AdminDrivers />} />
            <Route path="drivers/:driverId" element={<AdminDriverDetails />} />
            <Route path="finance" element={<AdminFinance />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;