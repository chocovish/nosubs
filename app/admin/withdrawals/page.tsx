'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { getWithdrawals, updateWithdrawalStatus, type WithdrawalStatus } from '@/app/actions/admin';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const transactionFormSchema = z.object({
  transactionId: z.string().min(1, 'Transaction ID is required'),
  date: z.string().min(1, 'Date is required'),
  reference: z.string().min(1, 'Reference number is required'),
  notes: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionFormSchema>;

interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  status: WithdrawalStatus;
  bankDetails: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };
  transactionDetails?: {
    transactionId: string;
    date: string;
    reference: string;
    notes?: string;
  };
  createdAt: string;
}

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      transactionId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      reference: '',
      notes: ''
    }
  });

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const data = await getWithdrawals();
      setWithdrawals(data);
    } catch (error) {
      toast.error('Failed to fetch withdrawals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (withdrawalId: string, newStatus: WithdrawalStatus) => {
    try {
      if (newStatus === 'completed') {
        // Find the withdrawal and show the transaction dialog
        const withdrawal = withdrawals.find(w => w.id === withdrawalId);
        if (withdrawal) {
          setSelectedWithdrawal(withdrawal);
          setShowTransactionDialog(true);
          return;
        }
      }

      await updateWithdrawalStatus(withdrawalId, newStatus);
      toast.success('Withdrawal status updated successfully');
      fetchWithdrawals();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update withdrawal status');
    }
  };

  const handleTransactionSubmit = async (data: TransactionFormData) => {
    if (!selectedWithdrawal) return;

    try {
      await updateWithdrawalStatus(selectedWithdrawal.id, 'completed', data);
      toast.success('Withdrawal completed successfully');
      setShowTransactionDialog(false);
      setSelectedWithdrawal(null);
      form.reset();
      fetchWithdrawals();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to complete withdrawal');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(withdrawal.createdAt), 'PPP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {withdrawal.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{withdrawal.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>
                        <p>{withdrawal.bankDetails.accountHolderName}</p>
                        <p>{withdrawal.bankDetails.bankName}</p>
                        <p>Account: {withdrawal.bankDetails.accountNumber}</p>
                        <p>IFSC: {withdrawal.bankDetails.ifscCode}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                          withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          withdrawal.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'}`}>
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {withdrawal.transactionDetails && (
                        <div>
                          <p>ID: {withdrawal.transactionDetails.transactionId}</p>
                          <p>Date: {withdrawal.transactionDetails.date ? format(new Date(withdrawal.transactionDetails.date), 'PPP') : 'N/A'}</p>
                          <p>Ref: {withdrawal.transactionDetails.reference}</p>
                          {withdrawal.transactionDetails.notes && (
                            <p>Notes: {withdrawal.transactionDetails.notes}</p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {withdrawal.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(withdrawal.id, 'processing')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Process
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(withdrawal.id, 'rejected')}
                            className="text-red-600 hover:text-red-800"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {withdrawal.status === 'processing' && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(withdrawal.id, 'completed')}
                            className="text-green-600 hover:text-green-800"
                          >
                            Complete
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(withdrawal.id, 'pending')}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            Back to Pending
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(withdrawal.id, 'rejected')}
                            className="text-red-600 hover:text-red-800"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Withdrawal</DialogTitle>
            <DialogDescription>
              Please provide transaction details for the withdrawal of ₹{selectedWithdrawal?.amount.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleTransactionSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter transaction ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reference number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter any additional notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowTransactionDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Complete Withdrawal
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 