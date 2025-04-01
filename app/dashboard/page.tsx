'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { getSalesData, getRecentSales, type SaleData, type RecentSale } from '@/app/actions/sales';
import { getUserBalance } from '@/app/actions/withdrawals';
import { useRouter } from 'next/navigation';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { SalesStats } from '@/components/dashboard/sales-stats';
import { RecentSales } from '@/components/dashboard/recent-sales';

export default function DashboardPage() {
  const router = useRouter();
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [balance, setBalance] = useState(0);
  const [timeframe, setTimeframe] = useState<'day' | 'month' | 'year'>('month');
  const [salesLimit, setSalesLimit] = useState('10');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesData, recentSalesData, userBalance] = await Promise.all([
          getSalesData(timeframe),
          getRecentSales(parseInt(salesLimit)),
          getUserBalance()
        ]);
        setSalesData(salesData);
        setRecentSales(recentSalesData);
        setBalance(userBalance);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [timeframe, salesLimit]);

  const handleLimitChange = (newLimit: string) => {
    setSalesLimit(newLimit);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Sales Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
              </div>
              <Button onClick={() => router.push('/withdrawals')}>
                Request Withdrawal
              </Button>
            </div>
          </div>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setTimeframe('day')}
              className={`px-4 py-2 rounded ${timeframe === 'day' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-4 py-2 rounded ${timeframe === 'month' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-4 py-2 rounded ${timeframe === 'year' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SalesChart data={salesData} />
          <SalesStats data={salesData} />
        </div>

        <div className="mt-8">
          <RecentSales 
            sales={recentSales} 
            onLimitChange={handleLimitChange}
            currentLimit={salesLimit}
          />
        </div>
      </main>
    </div>
  );
}