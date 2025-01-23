import { ShopifySettings } from "@/components/seller/ShopifySettings";

export default function SellerSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <ShopifySettings />
    </div>
  );
}