import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import DriverSignup from "./pages/auth/DriverSignup";
import MotoboyDashboard from "./pages/MotoboyDashboard";
import MobileNav from "./components/MobileNav";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminDrivers from "./pages/admin/AdminDrivers";
import AdminDriversList from "./pages/admin/AdminDriversList";
import AdminDriverDetails from "./pages/admin/AdminDriverDetails";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductDetails from "./pages/admin/AdminProductDetails";
import AdminFinance from "./pages/admin/AdminFinance";
import AdminSettings from "./pages/admin/AdminSettings";
import CreateProduct from "./pages/admin/CreateProduct";
import CreateOrder from "./pages/admin/CreateOrder";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/driver-signup" element={<DriverSignup />} />
        
        {/* Motoboy Routes */}
        <Route path="/motoboy/dashboard" element={
          <>
            <MotoboyDashboard />
            <MobileNav />
          </>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/new" element={<CreateOrder />} />
          <Route path="orders/:orderId" element={<AdminOrderDetails />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="drivers/list" element={<AdminDriversList />} />
          <Route path="drivers/:driverId" element={<AdminDriverDetails />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<CreateProduct />} />
          <Route path="products/:productId" element={<AdminProductDetails />} />
          <Route path="finance" element={<AdminFinance />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;