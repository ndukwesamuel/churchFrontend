import { Card, CardContent } from "@/components/ui/card";
import { fmt } from "../../../utils/helpers";

function WalletStats({ transactions }) {
  const totalFunded = transactions
    .filter((t) => t.type === "credit")
    .reduce((s, t) => s + t.amount, 0);
  const totalSpent = transactions
    .filter((t) => t.type === "debit")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardContent className="py-4">
          <div className="text-sm opacity-80">Total funded</div>
          <div className="mt-2 text-lg font-medium">{fmt(totalFunded)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <div className="text-sm opacity-80">Total spent</div>
          <div className="mt-2 text-lg font-medium">{fmt(totalSpent)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <div className="text-sm opacity-80">Transactions</div>
          <div className="mt-2 text-lg font-medium">{transactions.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default WalletStats;
