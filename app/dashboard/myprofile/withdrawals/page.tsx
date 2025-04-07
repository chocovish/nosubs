'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getWithdrawals, requestWithdrawal, type Withdrawal, getUserBalance, deleteWithdrawal } from '@/app/actions/withdrawals';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Trash2, Info, Wallet, PiggyBank, AlertTriangle, CreditCard } from 'lucide-react';
import { TransactionDetailsDialog } from '@/components/withdrawals/transaction-details-dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

const withdrawalSchema = z.object({
  amount: z.number()
    .min(0.01, 'Amount must be greater than 0')
});

type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

export default function WithdrawalsPage() {
  const queryClient = useQueryClient();
  // Fetch user balance with React Query
  const { data: balance = 0, isLoading: isBalanceLoading } = useQuery({
    queryKey: ['balance'],
    queryFn: getUserBalance
  });
  
  // Request withdrawal mutation
  const withdrawalMutation = useMutation({
    mutationFn: (data: WithdrawalFormValues) => requestWithdrawal({
      amount: data.amount
    }),
    onSuccess: () => {
      // Reset form
      form.reset();
      
      // Show success message
      toast.success('Withdrawal request submitted successfully');
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to request withdrawal');
    }
  });

  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0
    }
  });

  const onSubmit = (data: WithdrawalFormValues) => {
    withdrawalMutation.mutate(data);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Withdrawals</h1>
          <p className="text-gray-500">Manage your withdrawals and view transaction history</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg flex items-center gap-3 mb-6 border border-blue-100">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2 text-white">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Available Balance</p>
            <p className="font-bold text-xl">${balance.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-blue-600" />
                <span>Request Withdrawal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input
                              type="number"
                              placeholder="Enter amount"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              min="0.01"
                              step="0.01"
                              className="pl-8 border-blue-200 focus:border-blue-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                  <div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p>Funds will be transferred to your default payment method.</p>
                      <Link 
                        href="/dashboard/myprofile/payment" 
                        className="text-blue-600 underline hover:text-blue-800 mt-1 inline-block">
                        Manage payment methods
                      </Link>
                    </div>
                  </div>

                  {withdrawalMutation.error && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {withdrawalMutation.error.message || 'Failed to request withdrawal'}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={withdrawalMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    {withdrawalMutation.isPending ? 'Processing...' : 'Request Withdrawal'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {PaymentDetailsUpdateHistory()}
        </div>
      </div>
    </>
  );
} 

function PaymentDetailsUpdateHistory() {
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const queryClient = useQueryClient();
  // Fetch withdrawals with React Query
  const { data: withdrawals = [], isLoading: isWithdrawalsLoading } = useQuery({
    queryKey: ['withdrawals'],
    queryFn: getWithdrawals
  });
  // Delete withdrawal mutation
  const deleteMutation = useMutation({
    mutationFn: (withdrawalId: string) => deleteWithdrawal(withdrawalId),
    onSuccess: () => {
      toast.success('Withdrawal request deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete withdrawal');
    }
  });

  const handleDeleteWithdrawal = (withdrawalId: string) => {
    deleteMutation.mutate(withdrawalId);
  };

  const openTransactionDetails = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowTransactionDialog(true);
  };

  return <Card className="bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <CardHeader className="pb-2">
      <CardTitle className="text-xl font-semibold">Withdrawal History</CardTitle>
    </CardHeader>
    <CardContent>
      {isWithdrawalsLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading withdrawals...</p>
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No withdrawal requests yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(withdrawal.createdAt), 'PPP')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                    ${withdrawal.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                          withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            withdrawal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'}`}>
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </span>
                      {withdrawal.status === 'completed' && withdrawal.transactionDetails && (
                        <button
                          onClick={() => openTransactionDetails(withdrawal)}
                          className="text-blue-500 hover:text-blue-700 focus:outline-none ml-1"
                        >
                          <Info className="h-4 w-4 cursor-pointer" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {withdrawal.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteWithdrawal(withdrawal.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CardContent>
    <TransactionDetailsDialog
        open={showTransactionDialog}
        onOpenChange={setShowTransactionDialog}
        withdrawal={selectedWithdrawal} 
      />
  </Card>;
}
