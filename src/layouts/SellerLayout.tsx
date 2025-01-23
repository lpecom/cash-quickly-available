import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { SellerMenu } from "@/components/seller/SellerMenu";

const SellerLayout = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <SellerMenu />
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SellerLayout;