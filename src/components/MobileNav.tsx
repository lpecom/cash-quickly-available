import { Package, DollarSign, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const MobileNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        <Link
          to="/entregas"
          className={`flex flex-col items-center ${
            location.pathname === "/entregas" ? "text-primary" : "text-gray-500"
          }`}
        >
          <Package className="w-6 h-6" />
          <span className="text-xs mt-1">Pedidos</span>
        </Link>
        <Link
          to="/coletas"
          className={`flex flex-col items-center ${
            location.pathname === "/coletas" ? "text-primary" : "text-gray-500"
          }`}
        >
          <Package className="w-6 h-6" />
          <span className="text-xs mt-1">Coletas</span>
        </Link>
        <Link
          to="/pagamentos"
          className={`flex flex-col items-center ${
            location.pathname === "/pagamentos" ? "text-primary" : "text-gray-500"
          }`}
        >
          <DollarSign className="w-6 h-6" />
          <span className="text-xs mt-1">Pagamentos</span>
        </Link>
        <Link
          to="/perfil"
          className={`flex flex-col items-center ${
            location.pathname === "/perfil" ? "text-primary" : "text-gray-500"
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Perfil</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;