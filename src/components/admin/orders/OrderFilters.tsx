import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { DateRange } from "react-day-picker";

interface OrderFiltersProps {
  onFiltersChange: (filters: {
    dateRange?: DateRange;
    status?: string;
    search?: string;
  }) => void;
}

export function OrderFilters({ onFiltersChange }: OrderFiltersProps) {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente ou ID"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onFiltersChange({ search: e.target.value });
              }}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <DateRangePicker
            onChange={(range) => {
              onFiltersChange({ dateRange: range || undefined });
            }}
          />
          <Select
            onValueChange={(value) => onFiltersChange({ status: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="on_route">Em rota</SelectItem>
              <SelectItem value="delivered">Entregue</SelectItem>
              <SelectItem value="not_delivered">Não entregue</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}