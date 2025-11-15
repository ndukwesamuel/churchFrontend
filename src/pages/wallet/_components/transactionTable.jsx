import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { fmt } from "../../../utils/helpers";

function TransactionsTable({ transactions }) {
  if (!transactions.length) {
    return (
      <div className="py-10 text-center opacity-80">
        <Clock className="mx-auto mb-4 w-6 h-6" />
        <div className="font-medium">No transactions yet</div>
        <p className="text-sm mt-2">Fund your wallet to see activity here.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => {
            const date = new Date(t.date).toLocaleString();
            const isCredit = t.type === "credit";
            const amt = (isCredit ? "+" : "-") + fmt(t.amount);
            return (
              <TableRow key={t.id} className="hover:bg-slate-50">
                <TableCell className="align-top text-xs md:text-sm">
                  {date}
                </TableCell>
                <TableCell className="align-top text-xs md:text-sm">
                  <div className="font-medium">{t.description}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {t.reference} • {t.channel}
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <Badge
                    variant={isCredit ? "secondary" : "outline"}
                    className={
                      isCredit
                        ? "bg-emerald-50 text-emerald-700"
                        : "border-red-200 text-red-600"
                    }
                  >
                    {isCredit ? (
                      <span className="flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> Credit
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <ArrowDownLeft className="w-3 h-3" /> Debit
                      </span>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="align-top">
                  <Badge
                    variant={
                      t.status === "success"
                        ? "secondary"
                        : t.status === "pending"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="align-top text-right font-medium text-xs md:text-sm">
                  <span
                    className={isCredit ? "text-emerald-600" : "text-red-600"}
                  >
                    {amt}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default TransactionsTable;
