import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { DateRange } from "react-day-picker";
import { OrderStatus } from "@/types/order";

interface OrderFiltersProps {
  onFiltersChange: (filters: {
    dateRange?: DateRange;
    status?: OrderStatus | "all";
    search?: string;
  }) => void;
}

export function OrderFilters({ onFiltersChange }: OrderFiltersProps) {
  const [search, setSearch] = useState("");

  const getStatusGroup = (status: OrderStatus) => {
    switch (status) {
      case "pending":
      case "confirmed":
      case "on_route":
        return "active";
      case "delivered":
        return "completed";
      case "not_delivered":
        return "rescheduled";
      default:
        return "all";
    }
  };

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
            onValueChange={(value) => {
              let statuses: OrderStatus[] = [];
              switch (value) {
                case "active":
                  statuses = ["pending", "confirmed", "on_route"];
                  break;
                case "completed":
                  statuses = ["delivered"];
                  break;
                case "rescheduled":
                  statuses = ["not_delivered"];
                  break;
                default:
                  onFiltersChange({ status: "all" });
                  return;
              }
              // For now, we'll just use the first status as we update the filtering logic
              onFiltersChange({ status: statuses[0] });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
              <SelectItem value="rescheduled">Reagendados</SelectItem>
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