import { Button } from "@/components/ui/button";
import {
  Select as ShadSelect,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

function TransactionFilters({ type, status, onTypeChange, onStatusChange }) {
  const baseActive = "bg-deepPurple text-white hover:bg-deepPurple";

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={type === "all" ? "default" : "ghost"}
          className={type === "all" ? baseActive : ""}
          onClick={() => onTypeChange("all")}
        >
          All
        </Button>
        <Button
          size="sm"
          variant={type === "credit" ? "default" : "ghost"}
          className={type === "credit" ? baseActive : ""}
          onClick={() => onTypeChange("credit")}
        >
          Credit
        </Button>
        <Button
          size="sm"
          variant={type === "debit" ? "default" : "ghost"}
          className={type === "debit" ? baseActive : ""}
          onClick={() => onTypeChange("debit")}
        >
          Debit
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <ShadSelect value={status} onValueChange={(v) => onStatusChange(v)}>
          <SelectTrigger className="h-8 w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </ShadSelect>
      </div>
    </div>
  );
}

export default TransactionFilters;
