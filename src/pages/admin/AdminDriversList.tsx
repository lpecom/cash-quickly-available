import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, DollarSign, Package, CheckCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const AdminDriversList = () => {
  const { data: drivers, isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'motoboy');

      if (error) throw error;
      return profiles;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Entregadores</h1>
          <p className="text-muted-foreground">
            Lista de entregadores cadastrados
          </p>
        </div>
        <Button className="bg-primary text-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Novo Entregador
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {drivers?.map((driver) => (
          <Card key={driver.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary p-2">
                    <User className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <Link
                      to={`/admin/drivers/${driver.id}`}
                      className="font-semibold hover:text-primary-foreground/80"
                    >
                      {driver.full_name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {driver.phone || 'Sem telefone'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Status</span>
                    <span className="font-medium text-sm">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/20 text-foreground text-xs">
                        Ativo
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Entregas</span>
                    <span className="font-medium text-sm">--</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Avaliação</span>
                    <span className="font-medium text-sm">--</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDriversList;