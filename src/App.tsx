import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import DriverSignup from "./pages/auth/DriverSignup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/driver-signup" element={<DriverSignup />} />
      </Routes>
    </Router>
  );
}

export default App;