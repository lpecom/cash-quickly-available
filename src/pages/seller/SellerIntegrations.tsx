import { ShopifySettings } from "@/components/seller/ShopifySettings";

export default function SellerIntegrations() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Integrações</h1>
      <p className="text-muted-foreground">
        Gerencie suas integrações com plataformas externas
      </p>
      <ShopifySettings />
    </div>
  );
}