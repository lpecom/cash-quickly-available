import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import DriverSignup from "./pages/auth/DriverSignup";
import MotoboyDashboard from "./pages/MotoboyDashboard";
import MobileNav from "./components/MobileNav";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/driver-signup" element={<DriverSignup />} />
        <Route path="/motoboy/dashboard" element={
          <>
            <MotoboyDashboard />
            <MobileNav />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;