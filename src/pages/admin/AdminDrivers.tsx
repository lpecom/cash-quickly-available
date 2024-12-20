import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, User } from "lucide-react";

const AdminDrivers = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Entregadores</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Entregador
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Entregas Hoje</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead>Ganhos Hoje</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Carlos Santos</TableCell>
              <TableCell>
                <Badge variant="secondary">Disponível</Badge>
              </TableCell>
              <TableCell>8</TableCell>
              <TableCell>4.8 ⭐</TableCell>
              <TableCell>R$ 120,00</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDrivers;