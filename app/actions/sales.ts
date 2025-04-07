'use server';

import { auth, requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { dateKeyMaker } from '@/lib/utils';

export interface SaleData {
  date: string;
  amount: number;
  transactions: number;
  uniqueCustomers: Set<string|null>;
}
export interface RecentSale {
  id: string;
  amount: number;
  createdAt: Date;
  productName: string;
  buyerName: string;
}

export async function getSalesData(timeframe: 'day' | 'month' | 'year') {
  try {
    const user = await requireAuth();
    const userId = user.id;
    const today = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'day':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 12, 1);
        break;
      case 'year':
        startDate = new Date(today.getFullYear() - 5, 0, 1);
        break;
    }

    const sales = await prisma.sale.findMany({
      where: {
        sellerId: userId,
        createdAt: {
          gte: startDate
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Format the data based on timeframe
    const formattedSales = sales.reduce<SaleData[]>((acc, sale) => {
      const date = new Date(sale.createdAt);
      const dateKey = dateKeyMaker(timeframe, date);

      const existingEntry = acc.find(entry => entry.date === dateKey);
      if (existingEntry) {
        existingEntry.amount += sale.amount;
        existingEntry.transactions++;
        existingEntry.uniqueCustomers.add(sale.buyerId);

      } else {
        acc.push({ date: dateKey, amount: sale.amount, transactions: 1, uniqueCustomers: new Set([sale.buyerId]) });
      }

      return acc;
    }, []);

    return formattedSales;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw new Error('Failed to fetch sales data');
  }
}

export async function getRecentSales(limit: number = 10) {
  try {
    const user = await requireAuth();
    const userId = user.id;
    const recentSales = await prisma.sale.findMany({
      where: {
        sellerId: userId,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      include: {
        product: true,
        buyer: true,
      }
    });

    return recentSales.map(sale => ({
      id: sale.id,
      amount: sale.amount,
      createdAt: sale.createdAt,
      productName: sale.product.title,
      buyerName: sale.buyer?.name || 'Anonymous'
    }));
  } catch (error) {
    console.error('Error fetching recent sales:', error);
    throw new Error('Failed to fetch recent sales');
  }
}