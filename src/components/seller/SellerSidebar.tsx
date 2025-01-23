import {
  LayoutDashboard,
  Package,
  DollarSign,
  Settings,
  ShoppingCart,
  HeadphonesIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/seller" },
  { title: "Produtos", icon: Package, url: "/seller/products" },
  { title: "Pedidos", icon: ShoppingCart, url: "/seller/orders" },
  { title: "Financeiro", icon: DollarSign, url: "/seller/finance" },
  { title: "Suporte", icon: HeadphonesIcon, url: "/seller/support" },
  { title: "Configurações", icon: Settings, url: "/seller/settings" },
];

export function SellerSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <div className="p-6">
            <div className="flex items-center justify-center">
              <img 
                src="https://www.paguequandochegar.com/cdn/shop/files/LOGO-min.png?v=1732965324" 
                alt="Pague Quando Chegar Logo" 
                className="h-12 object-contain"
              />
            </div>
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">
            Gerenciamento
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground/80 transition-colors hover:text-primary data-[active=true]:text-primary"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}