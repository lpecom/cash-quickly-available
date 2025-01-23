import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Package, Settings, Store } from "lucide-react";
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
      title: "Catálogo",
      icon: Package,
      href: "/seller/catalog",
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
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "w-full",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                )
              }
            >
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Button>
            </NavLink>
          ))}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
};