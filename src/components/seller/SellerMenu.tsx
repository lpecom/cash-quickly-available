import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Settings, PuzzleIcon } from "lucide-react";

const menuItems = [
  { 
    label: "Dashboard", 
    path: "/seller",
    icon: Package
  },
  { 
    label: "Integrações", 
    path: "/seller/integrations",
    icon: PuzzleIcon
  },
  { 
    label: "Configurações", 
    path: "/seller/settings",
    icon: Settings
  }
];

export function SellerMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = menuItems.find((item) => item.path === location.pathname)?.path || menuItems[0].path;

  return (
    <Tabs value={activeTab} className="w-full" onValueChange={(value) => navigate(value)}>
      <TabsList className="w-full justify-start">
        {menuItems.map((item) => (
          <TabsTrigger
            key={item.path}
            value={item.path}
            className="text-sm font-medium"
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}