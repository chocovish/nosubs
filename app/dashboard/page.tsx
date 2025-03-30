'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/header';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getSalesData, type SaleData } from '@/app/actions/sales';



export default function DashboardPage() {
  const { data: session } = useSession();
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [timeframe, setTimeframe] = useState<'day' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const data = await getSalesData(timeframe);
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    if (session) {
      fetchSalesData();
    }
  }, [session, timeframe]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Sales Dashboard</h1>
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
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Sales Statistics</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold">
                  ${salesData.reduce((sum, sale) => sum + sale.amount, 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Average Sale</p>
                <p className="text-2xl font-bold">
                  ${(salesData.reduce((sum, sale) => sum + sale.amount, 0) / (salesData.length || 1)).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold">{salesData.reduce((t, sale)=>t+sale.transactions, 0)}</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}