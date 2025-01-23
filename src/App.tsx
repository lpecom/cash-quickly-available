import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import CreateProduct from "./pages/admin/CreateProduct";
import AdminProductDetails from "./pages/admin/AdminProductDetails";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import CreateOrder from "./pages/admin/CreateOrder";
import AdminDrivers from "./pages/admin/AdminDrivers";
import AdminDriverDetails from "./pages/admin/AdminDriverDetails";
import AdminFinance from "./pages/admin/AdminFinance";
import AdminSettings from "./pages/admin/AdminSettings";
import MotoboyDashboard from "./pages/MotoboyDashboard";
import MotoboyPayments from "./pages/MotoboyPayments";
import MotoboySales from "./pages/MotoboySales";
import OrderDetails from "./pages/OrderDetails";
import AuthPage from "./pages/auth/AuthPage";
import Checkout from "./pages/Checkout";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/checkout/:productId" element={<Checkout />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<CreateProduct />} />
          <Route path="products/:productId" element={<AdminProductDetails />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/new" element={<CreateOrder />} />
          <Route path="orders/:orderId" element={<AdminOrderDetails />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="drivers/:driverId" element={<AdminDriverDetails />} />
          <Route path="finance" element={<AdminFinance />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="/motoboy">
          <Route index element={<MotoboyDashboard />} />
          <Route path="payments" element={<MotoboyPayments />} />
          <Route path="sales" element={<MotoboySales />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;