import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, PieChart, Receipt, Wallet } from "lucide-react";

const menuItems = [
  { 
    label: "Solicitações", 
    path: "/admin/finance",
    icon: Receipt
  },
  { 
    label: "Relatórios", 
    path: "/admin/finance/reports",
    icon: PieChart
  },
  { 
    label: "Transações", 
    path: "/admin/finance/transactions",
    icon: Wallet
  },
  { 
    label: "Extratos", 
    path: "/admin/finance/statements",
    icon: FileText
  }
];

export function FinanceMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine the active tab based on the current path
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