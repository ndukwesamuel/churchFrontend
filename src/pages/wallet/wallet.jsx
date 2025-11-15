import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import WalletHeader from "./_components/walletHeader";
import TransactionFilters from "./_components/transactionFilter";
import TransactionsTable from "./_components/transactionTable";
import WalletStats from "./_components/walletStats";
import FundWalletDialog from "./_components/fundWalletDialog";
import { Separator } from "@/components/ui/separator";
const initialTransactions = [
  {
    id: "t_001",
    amount: 5000,
    type: "credit",
    status: "success",
    description: "Funding via Card",
    reference: "CARD-2938",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    channel: "Card",
  },
  {
    id: "t_002",
    amount: 1200,
    type: "debit",
    status: "success",
    description: "Paid subscription",
    reference: "SUB-120",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    channel: "Auto-debit",
  },
  {
    id: "t_003",
    amount: 20000,
    type: "credit",
    status: "pending",
    description: "Bank transfer",
    reference: "BANK-001",
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    channel: "Bank Transfer",
  },
];

export default function WalletPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [balance, setBalance] = useState(() =>
    initialTransactions.reduce(
      (s, t) => (t.type === "credit" ? s + t.amount : s - t.amount),
      0
    )
  );
  const [hidden, setHidden] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [fundOpen, setFundOpen] = useState(false);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      return true;
    });
  }, [transactions, filterType, filterStatus]);

  const handleFund = (amount, method) => {
    const tx = {
      id: `t_${Date.now()}`,
      amount,
      type: "credit",
      status: "success",
      description: `Funding via ${method}`,
      reference: `${method.toUpperCase()}-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString(),
      channel: method === "card" ? "Card" : method === "bank" ? "Bank" : "USSD",
    };
    setTransactions((s) => [tx, ...s]);
    setBalance((b) => b + amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-2">
      <div className="max-w- space-y-6">
        <WalletHeader
          balance={balance}
          hidden={hidden}
          onToggleHidden={() => setHidden((h) => !h)}
          onOpenFund={() => setFundOpen(true)}
        />

        <WalletStats transactions={transactions} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Transaction history</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TransactionFilters
              type={filterType}
              status={filterStatus}
              onTypeChange={setFilterType}
              onStatusChange={setFilterStatus}
            />
            <Separator />
            <TransactionsTable transactions={filtered} />
          </CardContent>
        </Card>

        <FundWalletDialog
          open={fundOpen}
          onClose={() => setFundOpen(false)}
          onFund={handleFund}
        />
      </div>
    </div>
  );
}
