import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TransactionDetails {
  transactionId: string;
  date: string;
  reference: string;
  notes?: string;
}

interface Withdrawal {
  id: string;
  amount: number;
  transactionDetails?: TransactionDetails;
}

interface TransactionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawal: Withdrawal | null;
}

export function TransactionDetailsDialog({
  open,
  onOpenChange,
  withdrawal
}: TransactionDetailsDialogProps) {
  if (!withdrawal || !withdrawal.transactionDetails) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Details of the completed withdrawal transaction.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Transaction ID:</div>
              <div>{withdrawal.transactionDetails.transactionId}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Date:</div>
              <div>{withdrawal.transactionDetails.date ? format(new Date(withdrawal.transactionDetails.date), 'PPP') : 'N/A'}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Reference:</div>
              <div>{withdrawal.transactionDetails.reference}</div>
            </div>
            {withdrawal.transactionDetails.notes && (
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Notes:</div>
                <div>{withdrawal.transactionDetails.notes}</div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 