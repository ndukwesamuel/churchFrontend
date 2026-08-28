import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const fundSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((value) => !Number.isNaN(Number(value)), "Amount must be a number")
    .refine((value) => Number(value) > 0, "Amount must be greater than 0"),
  method: z.enum(["card", "bank", "ussd"], {
    required_error: "Select a payment method",
  }),
});

function FundWalletDialog({ open, onClose, onFund }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(fundSchema),
    defaultValues: { amount: "", method: "card" },
  });

  const onSubmit = (values) => {
    const num = Number(values.amount);
    onFund(num, values.method);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fund Wallet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Amount</label>
            <Input
              {...register("amount")}
              placeholder="e.g. 10000"
              inputMode="numeric"
            />
            {errors.amount && (
              <p className="text-xs text-red-500 mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Payment method</label>
            <Select
              defaultValue="card"
              onValueChange={(value) => {
                // manually sync with react-hook-form
                // using hidden input registered as method
                document.querySelector('input[name="method"]').value = value;
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="ussd">USSD</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("method")} />
            {errors.method && (
              <p className="text-xs text-red-500 mt-1">
                {errors.method.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-deepPurple hover:bg-deepPurple"
            >
              {isSubmitting ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FundWalletDialog;
