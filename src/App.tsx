import { BrowserRouter, Routes, Route } from "react-router-dom";
import MotoboyDashboard from "./pages/MotoboyDashboard";
import MotoboyCollections from "./pages/MotoboyCollections";
import MotoboyPayments from "./pages/MotoboyPayments";
import MotoboyProfile from "./pages/MotoboyProfile";
import OrderDetails from "./pages/OrderDetails";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/entregas" element={<MotoboyDashboard />} />
        <Route path="/coletas" element={<MotoboyCollections />} />
        <Route path="/pagamentos" element={<MotoboyPayments />} />
        <Route path="/perfil" element={<MotoboyProfile />} />
        <Route path="/pedidos/:orderId" element={<OrderDetails />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
