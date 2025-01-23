import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminDrivers from "@/pages/admin/AdminDrivers";
import AdminSettings from "@/pages/admin/AdminSettings";
import OrderDetails from "@/pages/admin/OrderDetails";
import CreateOrder from "@/pages/admin/CreateOrder";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="orders/new" element={<CreateOrder />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;