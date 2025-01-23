import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import Index from "./pages/Index";
import AuthPage from "./pages/auth/AuthPage";
import MotoboyDashboard from "./pages/MotoboyDashboard";
import MotoboyPayments from "./pages/MotoboyPayments";
import MotoboySales from "./pages/MotoboySales";
import OrderDetails from "./pages/OrderDetails";
import MobileNav from "./components/MobileNav";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminDriversList from "./pages/admin/AdminDriversList";
import AdminDriverDetails from "./pages/admin/AdminDriverDetails";
import AdminFinance from "./pages/admin/AdminFinance";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductDetails from "./pages/admin/AdminProductDetails";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLayout from "./layouts/AdminLayout";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requiredRole = null }: { children: React.ReactNode; requiredRole?: "admin" | "motoboy" | "superadmin" | null }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Fetch user role
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching user role:", error);
              setLoading(false);
              return;
            }
            console.log("User role:", data?.role);
            setUserRole(data?.role ?? null);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching user role:", error);
              return;
            }
            console.log("User role changed:", data?.role);
            setUserRole(data?.role ?? null);
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && userRole !== requiredRole && userRole !== 'superadmin') {
    console.log("Access denied. Required role:", requiredRole, "User role:", userRole);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Motoboy Routes */}
          <Route
            path="/motoboy"
            element={
              <ProtectedRoute requiredRole="motoboy">
                <MotoboyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/motoboy/payments"
            element={
              <ProtectedRoute requiredRole="motoboy">
                <MotoboyPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/motoboy/sales"
            element={
              <ProtectedRoute requiredRole="motoboy">
                <MotoboySales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:orderId" element={<AdminOrderDetails />} />
            <Route path="drivers" element={<AdminDriversList />} />
            <Route path="drivers/:driverId" element={<AdminDriverDetails />} />
            <Route path="finance" element={<AdminFinance />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/:productId" element={<AdminProductDetails />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
        <MobileNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
