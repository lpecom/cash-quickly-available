import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";

export function Header() {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return profile;
    },
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout successful");
      navigate("/auth");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  if (!profile) return null;

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{profile.full_name}</p>
              <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}