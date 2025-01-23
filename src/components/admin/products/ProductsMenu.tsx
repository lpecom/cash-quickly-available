import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const menuItems = [
  { label: "Produtos", path: "/admin/products" },
  { label: "Fornecedores", path: "/admin/products/suppliers" },
  { label: "Gerenciar Estoque", path: "/admin/products/inventory" },
];

export function ProductsMenu() {
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
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}