import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Package, Settings, Store, Share2, List, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

export const SellerSidebar = () => {
  const menuItems = [
    {
      title: "Dashboard",
      icon: Store,
      href: "/seller",
    },
    {
      title: "Pedidos",
      icon: List,
      href: "/seller/orders",
    },
    {
      title: "Catálogo",
      icon: Package,
      href: "/seller/catalog",
    },
    {
      title: "Meus Produtos",
      icon: ShoppingBag,
      href: "/seller/products",
    },
    {
      title: "Integrações",
      icon: Share2,
      href: "/seller/integrations",
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/seller/settings",
    },
  ];

  return (
    <Sidebar>
      <SidebarContent className="py-4">
        <div className="p-6">
          <div className="flex items-center justify-center">
            <img 
              src="https://www.paguequandochegar.com/cdn/shop/files/LOGO-min.png?v=1732965324" 
              alt="Pague Quando Chegar Logo" 
              className="h-12 object-contain"
            />
          </div>
        </div>
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
};