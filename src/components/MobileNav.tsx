import { Home, DollarSign, ShoppingCart, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const MobileNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
      <div className="flex justify-around items-center">
        <Link
          to="/motoboy"
          className={`flex flex-col items-center ${
            location.pathname === "/motoboy" ? "text-primary" : "text-gray-500"
          }`}
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="text-xs mt-1">Entregas</span>
        </Link>
        <Link
          to="/motoboy/dashboard"
          className={`flex flex-col items-center ${
            location.pathname === "/motoboy/dashboard" ? "text-primary" : "text-gray-500"
          }`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link
          to="/motoboy/payments"
          className={`flex flex-col items-center ${
            location.pathname === "/motoboy/payments" ? "text-primary" : "text-gray-500"
          }`}
        >
          <DollarSign className="w-6 h-6" />
          <span className="text-xs mt-1">Pagamentos</span>
        </Link>
        <Link
          to="/motoboy/sales"
          className={`flex flex-col items-center ${
            location.pathname === "/motoboy/sales" ? "text-primary" : "text-gray-500"
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Pedidos</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;