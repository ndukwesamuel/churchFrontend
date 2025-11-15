import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Plus } from "lucide-react";
import { fmt } from "../../../utils/helpers";
function WalletHeader({ balance, hidden, onToggleHidden, onOpenFund }) {
  return (
    <Card className="bg-deepPurple text-white">
      <CardContent>
        <div className="flex flex-col items-cente justify-between gap-4 md:flex-row">
          <div className="py-4">
            <div className="text-sm opacity-90">Wallet balance</div>
            <div className="mt-2 flex items-center gap-3">
              <h2 className="text-3xl font-semibold">
                {hidden ? "••••••" : fmt(balance)}
              </h2>
              <button
                onClick={onToggleHidden}
                aria-label={hidden ? "Show balance" : "Hide balance"}
                className="p-2 rounded-md bg-white/10 hover:bg-white/20"
              >
                {hidden ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs opacity-90 mt-1">Available to spend</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={onOpenFund}
              className="bg-white text-deepPurple hover:bg-white"
            >
              <Plus className="mr-2 w-4 h-4" /> Fund Wallet
            </Button>
            {/* <Button
              variant="outline"
              className="hidden md:inline-flex border-white/40 text-white hover:bg-white/10"
            >
              Withdraw
            </Button> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WalletHeader;
