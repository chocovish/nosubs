'use server';

import { prisma } from '@/lib/prisma';
import { requireAuth, AuthError } from '@/lib/auth-helper';

export interface WithdrawalRequest {
  amount: number;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
  };
}

export interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  createdAt: Date;
  bankDetails: string;
}

export async function getWithdrawals() {
  try {
    const { userId } = await requireAuth();

    const withdrawals = await prisma.withdrawal.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return withdrawals.map(withdrawal => ({
      id: withdrawal.id,
      amount: withdrawal.amount,
      status: withdrawal.status,
      createdAt: withdrawal.createdAt,
      bankDetails: JSON.parse(withdrawal.bankDetails)
    }));
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error('Error fetching withdrawals:', error);
    throw new Error('Failed to fetch withdrawals');
  }
}

export async function requestWithdrawal(data: WithdrawalRequest) {
  try {
    const { userId } = await requireAuth();

    // Get user's current balance
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.balance < data.amount) {
      throw new Error('Insufficient balance');
    }

    // Create withdrawal request
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId,
        amount: data.amount,
        bankDetails: JSON.stringify(data.bankDetails)
      }
    });

    // Deduct amount from user's balance
    await prisma.user.update({
      where: { id: userId },
      data: { balance: user.balance - data.amount }
    });

    return withdrawal;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error('Error requesting withdrawal:', error);
    throw new Error('Failed to request withdrawal');
  }
}

export async function getUserBalance() {
  try {
    const { userId } = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        balance: true,
        _count: {
          select: {
            sales: true,
            withdrawals: {
              where: {
                status: {
                  in: ['completed', 'pending']
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return 0;
    }

    // If user has a non-zero balance, return it
    if (user.balance > 0) {
      return user.balance;
    }

    // Calculate total sales and withdrawals in the database
    const [totalSales, totalWithdrawals] = await Promise.all([
      prisma.sale.aggregate({
        where: {
          sellerId: userId
        },
        _sum: {
          amount: true
        }
      }),
      prisma.withdrawal.aggregate({
        where: {
          userId,
          status: {
            in: ['completed', 'pending']
          }
        },
        _sum: {
          amount: true
        }
      })
    ]);

    // Calculate and update the balance
    const calculatedBalance = (totalSales._sum.amount || 0) - (totalWithdrawals._sum.amount || 0);

    // Update the user's balance in the database
    await prisma.user.update({
      where: { id: userId },
      data: { balance: calculatedBalance }
    });

    return calculatedBalance;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error('Error fetching user balance:', error);
    throw new Error('Failed to fetch user balance');
  }
}

export async function deleteWithdrawal(withdrawalId: string) {
  try {
    const { userId } = await requireAuth();

    // Find the withdrawal and verify ownership
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId }
    });

    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }

    if (withdrawal.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (withdrawal.status !== 'pending') {
      throw new Error('Only pending withdrawals can be deleted');
    }

    // Use a transaction to ensure both operations succeed or fail together
    await prisma.$transaction([
      // Delete the withdrawal
      prisma.withdrawal.delete({
        where: { id: withdrawalId }
      }),
      // Refund the amount back to user's balance
      prisma.user.update({
        where: { id: userId },
        data: {
          balance: {
            increment: withdrawal.amount
          }
        }
      })
    ]);

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error('Error deleting withdrawal:', error);
    throw new Error('Failed to delete withdrawal');
  }
} 