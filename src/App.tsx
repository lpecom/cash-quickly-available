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
import Index from "./pages/Index";
import AdminAuthPage from "./pages/auth/AdminAuthPage";
import MotoboyAuthPage from "./pages/auth/MotoboyAuthPage";
import SellerAuthPage from "./pages/auth/SellerAuthPage";
import DriverSignup from "./pages/auth/DriverSignup";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import { Toaster } from "sonner";
import SellerLayout from "./layouts/SellerLayout";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerSettings from "./pages/seller/SellerSettings";
import SellerIntegrations from "./pages/seller/SellerIntegrations";
import SellerCatalog from "./pages/seller/SellerCatalog";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerOrders from "./pages/seller/SellerOrders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Index />} />

        {/* Auth Routes */}
        <Route path="/auth/admin" element={<AdminAuthPage />} />
        <Route path="/auth/motoboy" element={<MotoboyAuthPage />} />
        <Route path="/auth/seller" element={<SellerAuthPage />} />
        <Route path="/driver-signup" element={<DriverSignup />} />

        {/* Checkout Routes */}
        <Route path="/produto/:productId/checkout" element={<Checkout />} />
        <Route path="/success" element={<OrderSuccess />} />

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

        {/* Seller Routes */}
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<SellerDashboard />} />
          <Route path="catalog" element={<SellerCatalog />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="settings" element={<SellerSettings />} />
          <Route path="integrations" element={<SellerIntegrations />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
