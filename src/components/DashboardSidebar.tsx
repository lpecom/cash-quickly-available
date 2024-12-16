import {
  User,
  Users,
  ShoppingBag,
  LayoutGrid,
  FileText,
  Package,
  MapPin,
  Network,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Perfil", icon: User, url: "#" },
  { title: "Recrute e Ganhe", icon: Users, url: "#" },
  { title: "Loja", icon: ShoppingBag, url: "#" },
  {
    title: "Relatórios",
    icon: FileText,
    url: "#",
    submenu: [
      { title: "Dashboard", url: "/" },
      { title: "Lista", url: "#" },
      { title: "Abandonos de carrinho", url: "#" },
    ],
  },
  { title: "Produtos", icon: Package, url: "#" },
  { title: "Localidades", icon: MapPin, url: "#" },
  { title: "Integrações", icon: Network, url: "#" },
];

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Logzz</h1>
          </div>
          <button className="mt-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            Trocar de versão
          </button>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.submenu && (
                    <SidebarMenuSub>
                      {item.submenu.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            href={subItem.url}
                            isActive={subItem.url === "/"}
                          >
                            {subItem.title}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}