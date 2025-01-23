import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Settings,
  ShoppingCart,
  HeadphonesIcon,
  PuzzleIcon,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/seller" },
  { title: "Produtos", icon: Package, url: "/seller/products" },
  { title: "Pedidos", icon: ShoppingCart, url: "/seller/orders" },
  { title: "Financeiro", icon: DollarSign, url: "/seller/finance" },
  { title: "Integrações", icon: PuzzleIcon, url: "/seller/integrations" },
  { title: "Suporte", icon: HeadphonesIcon, url: "/seller/support" },
  { title: "Configurações", icon: Settings, url: "/seller/settings" },
];

export function SellerMenu() {
  const location = useLocation();

  return (
    <nav className="border-b">
      <div className="px-4">
        <div className="flex h-16 items-center space-x-4">
          <div className="flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.url}
                to={item.url}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.url
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}