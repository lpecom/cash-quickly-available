import { BrowserRouter, Routes, Route } from "react-router-dom";
import MotoboyDashboard from "./pages/MotoboyDashboard";
import MotoboyCollections from "./pages/MotoboyCollections";
import MotoboyPayments from "./pages/MotoboyPayments";
import MotoboyProfile from "./pages/MotoboyProfile";
import OrderDetails from "./pages/OrderDetails";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDrivers from "./pages/admin/AdminDrivers";
import AdminFinance from "./pages/admin/AdminFinance";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import CreateOrder from "./pages/admin/CreateOrder";
import CreateProduct from "./pages/admin/CreateProduct";
import AdminProductDetails from "./pages/admin/AdminProductDetails";
import AdminDriverDetails from "./pages/admin/AdminDriverDetails";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Motoboy Routes */}
        <Route path="/entregas" element={<MotoboyDashboard />} />
        <Route path="/coletas" element={<MotoboyCollections />} />
        <Route path="/pagamentos" element={<MotoboyPayments />} />
        <Route path="/perfil" element={<MotoboyProfile />} />
        <Route path="/pedidos/:orderId" element={<OrderDetails />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/new" element={<CreateOrder />} />
          <Route path="orders/:orderId" element={<AdminOrderDetails />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="drivers/:driverId" element={<AdminDriverDetails />} />
          <Route path="finance" element={<AdminFinance />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<CreateProduct />} />
          <Route path="products/:productId" element={<AdminProductDetails />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;