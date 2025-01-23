import { BrowserRouter, Routes, Route } from "react-router-dom";
import MotoboyDashboard from "./pages/MotoboyDashboard";
import MotoboyCollections from "./pages/MotoboyCollections";
import MotoboyPayments from "./pages/MotoboyPayments";
import MotoboyProfile from "./pages/MotoboyProfile";
import OrderDetails from "./pages/OrderDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminDrivers from "./pages/admin/AdminDrivers";
import AdminDriverDetails from "./pages/admin/AdminDriverDetails";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductDetails from "./pages/admin/AdminProductDetails";
import AdminFinance from "./pages/admin/AdminFinance";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminConfigurations from "./pages/admin/AdminConfigurations";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminSuppliers from "./pages/admin/AdminSuppliers";
import CreateOrder from "./pages/admin/CreateOrder";
import CreateProduct from "./pages/admin/CreateProduct";
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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:orderId" element={<AdminOrderDetails />} />
        <Route path="/admin/orders/new" element={<CreateOrder />} />
        <Route path="/admin/drivers" element={<AdminDrivers />} />
        <Route path="/admin/drivers/:driverId" element={<AdminDriverDetails />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/:productId" element={<AdminProductDetails />} />
        <Route path="/admin/products/new" element={<CreateProduct />} />
        <Route path="/admin/finance" element={<AdminFinance />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/settings/configurations" element={<AdminConfigurations />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/suppliers" element={<AdminSuppliers />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;