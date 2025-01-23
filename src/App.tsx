import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import DriverSignup from "./pages/auth/DriverSignup";
import { SomeOtherComponent } from "./components/SomeOtherComponent"; // Example of another import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/driver-signup" element={<DriverSignup />} />
        <Route path="/some-other-route" element={<SomeOtherComponent />} /> {/* Example of another route */}
      </Routes>
    </Router>
  );
}

export default App;
