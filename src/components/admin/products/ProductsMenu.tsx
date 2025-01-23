import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Produtos", path: "/admin/products" },
  { label: "Fornecedores", path: "/admin/products/suppliers" },
  { label: "Gerenciar Estoque", path: "/admin/products/inventory" },
];

export function ProductsMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Menubar className="border-none bg-secondary/50 p-0">
      {menuItems.map((item) => (
        <MenubarMenu key={item.label}>
          <MenubarTrigger
            onClick={() => navigate(item.path)}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              location.pathname === item.path
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            {item.label}
          </MenubarTrigger>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}