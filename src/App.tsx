import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductDetails from "./pages/admin/AdminProductDetails";
import CreateProduct from "./pages/admin/CreateProduct";
import CreateOrder from "./pages/admin/CreateOrder";
import AdminDrivers from "./pages/admin/AdminDrivers";
import AdminDriverDetails from "./pages/admin/AdminDriverDetails";
import AdminFinance from "./pages/admin/AdminFinance";
import AdminSettings from "./pages/admin/AdminSettings";
import MotoboyDashboard from "./pages/MotoboyDashboard";
import MotoboySales from "./pages/MotoboySales";
import MotoboyPayments from "./pages/MotoboyPayments";
import OrderDetails from "./pages/OrderDetails";
import AuthPage from "./pages/auth/AuthPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/checkout/:productId" element={<Checkout />} />
        <Route path="/success" element={<OrderSuccess />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/new" element={<CreateOrder />} />
          <Route path="orders/:orderId" element={<AdminOrderDetails />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<CreateProduct />} />
          <Route path="products/:productId" element={<AdminProductDetails />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="drivers/:driverId" element={<AdminDriverDetails />} />
          <Route path="finance" element={<AdminFinance />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="/motoboy">
          <Route index element={<MotoboyDashboard />} />
          <Route path="sales" element={<MotoboySales />} />
          <Route path="payments" element={<MotoboyPayments />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;