import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto bg-secondary p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;