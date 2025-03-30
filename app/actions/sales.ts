'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export interface SaleData {
  date: string;
  amount: number;
  transactions: number;
}

export async function getSalesData(timeframe: 'day' | 'month' | 'year') {
  try {
    const session = await auth();
    const userId = session?.user.id;
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
      default:
        startDate = new Date(today.getFullYear(), today.getMonth() - 12, 1);
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
      let dateKey: string;

      switch (timeframe) {
        case 'day':
          dateKey = date.getHours().toString();
          break;
        case 'month':
          dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'year':
          dateKey = date.getFullYear().toString();
          break;
        default:
          dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      const existingEntry = acc.find(entry => entry.date === dateKey);
      if (existingEntry) {
        existingEntry.amount += sale.amount;
        existingEntry.transactions++;
      } else {
        acc.push({ date: dateKey, amount: sale.amount, transactions: 1 });
      }

      return acc;
    }, []);

    return formattedSales;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw new Error('Failed to fetch sales data');
  }
}