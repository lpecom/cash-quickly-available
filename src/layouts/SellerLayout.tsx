import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";
import { SellerSidebar } from "@/components/seller/SellerSidebar";

const SellerLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-secondary">
        <SellerSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SellerLayout;