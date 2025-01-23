import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Facebook, Globe, BrandTaboola, BrandTiktok } from "lucide-react";

interface PixelSettingsProps {
  config?: Record<string, any>;
}

export function PixelSettings({ config }: PixelSettingsProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Facebook className="h-5 w-5 text-blue-600" />
            <CardTitle>Facebook Pixel</CardTitle>
          </div>
          <Button variant="outline" size="sm">Salvar</Button>
        </CardHeader>
        <CardContent>
          <Label htmlFor="facebook-pixel">ID do Pixel</Label>
          <Input 
            id="facebook-pixel" 
            placeholder="Digite o ID do seu Facebook Pixel"
            defaultValue={config?.facebook_pixel_id}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-red-600" />
            <CardTitle>Google Tag</CardTitle>
          </div>
          <Button variant="outline" size="sm">Salvar</Button>
        </CardHeader>
        <CardContent>
          <Label htmlFor="google-tag">ID da Tag</Label>
          <Input 
            id="google-tag" 
            placeholder="Digite o ID do seu Google Tag"
            defaultValue={config?.google_tag_id}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <BrandTiktok className="h-5 w-5" />
            <CardTitle>TikTok Pixel</CardTitle>
          </div>
          <Button variant="outline" size="sm">Salvar</Button>
        </CardHeader>
        <CardContent>
          <Label htmlFor="tiktok-pixel">ID do Pixel</Label>
          <Input 
            id="tiktok-pixel" 
            placeholder="Digite o ID do seu TikTok Pixel"
            defaultValue={config?.tiktok_pixel_id}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <BrandTaboola className="h-5 w-5 text-blue-800" />
            <CardTitle>Taboola Pixel</CardTitle>
          </div>
          <Button variant="outline" size="sm">Salvar</Button>
        </CardHeader>
        <CardContent>
          <Label htmlFor="taboola-pixel">ID do Pixel</Label>
          <Input 
            id="taboola-pixel" 
            placeholder="Digite o ID do seu Taboola Pixel"
            defaultValue={config?.taboola_pixel_id}
          />
        </CardContent>
      </Card>
    </div>
  );
}