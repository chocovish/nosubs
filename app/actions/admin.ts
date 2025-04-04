'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
// import { Withdrawal } from '@prisma/client';
export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'rejected';
export interface Withdrawal {
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


export async function login(password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    throw new Error('Admin password not configured');
  }

  if (password === expectedPassword) {
    // Set admin password cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_password', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return { success: true };
  }

  throw new Error('Invalid password');
}

export async function getWithdrawals(): Promise<Withdrawal[]> {
  const withdrawals = await prisma.withdrawal.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return withdrawals.map(withdrawal => ({
    ...withdrawal,
    bankDetails: JSON.parse(withdrawal.bankDetails as string),
    transactionDetails: withdrawal.transactionDetails ? JSON.parse(withdrawal.transactionDetails as string) : undefined,
    createdAt: withdrawal.createdAt.toISOString(),
    status: withdrawal.status as WithdrawalStatus
  }));
}

export async function updateWithdrawalStatus(
  withdrawalId: string, 
  status: WithdrawalStatus,
  transactionDetails?: {
    transactionId: string;
    date: string;
    reference: string;
    notes?: string;
  }
) {
  // Validate status
  if (!['pending', 'processing', 'completed', 'rejected'].includes(status)) {
    throw new Error('Invalid status');
  }

  // Get the withdrawal to check its current status and amount
  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id: withdrawalId }
  });

  if (!withdrawal) {
    throw new Error('Withdrawal not found');
  }

  // If rejecting a withdrawal, refund the amount to user's balance
  if (status === 'rejected') {
    await prisma.$transaction([
      // Update withdrawal status
      prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: { 
          status,
          transactionDetails: null // Clear any existing transaction details
        }
      }),
      // Refund amount to user's balance
      prisma.user.update({
        where: { id: withdrawal.userId },
        data: {
          balance: {
            increment: withdrawal.amount
          }
        }
      })
    ]);
  } else {
    // For other status updates, update the status and transaction details if provided
    await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: { 
        status,
        ...(transactionDetails && {
          transactionDetails: JSON.stringify(transactionDetails)
        })
      }
    });
  }

  revalidatePath('/admin/withdrawals');
  return withdrawal;
} 