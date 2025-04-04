'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header/header';
import { Button } from '@/components/ui/button';
import { getSalesData, getRecentSales, type SaleData, type RecentSale } from '@/app/actions/sales';
import { getUserBalance } from '@/app/actions/withdrawals';
import { useRouter } from 'next/navigation';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { SalesStats } from '@/components/dashboard/sales-stats';
import { RecentSales } from '@/components/dashboard/recent-sales';
import { Card } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Calendar, 
  RefreshCw, 
  ArrowUpRight,
  Wallet
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [balance, setBalance] = useState(0);
  const [timeframe, setTimeframe] = useState<'day' | 'month' | 'year'>('month');
  const [salesLimit, setSalesLimit] = useState('10');
  const [isLoading, setIsLoading] = useState(true);

  // Calculate summary statistics
  const totalSales = salesData.reduce((sum, sale) => sum + sale.amount, 0);
  const totalTransactions = salesData.reduce((t, sale) => t + sale.transactions, 0);
  const avgOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;
  
  // Get growth percentage (mock data - this would be calculated from actual data)
  const salesGrowth = 12.5;
  const transactionsGrowth = 8.3;
  const aovGrowth = 4.2;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sales Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <Card className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-none shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Balance</p>
                    <p className="text-xl font-bold">${balance.toFixed(2)}</p>
                  </div>
                </div>
              </Card>
              <Button 
                onClick={() => router.push('/withdrawals')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Withdraw Funds
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Sales Card */}
            <Card className="p-4 border-none bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm transform hover:scale-[1.01] transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Sales</p>
                  <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
                  <div className="flex items-center mt-1 text-sm text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>{salesGrowth}% from last period</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            {/* Orders Card */}
            <Card className="p-4 border-none bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm transform hover:scale-[1.01] transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold">{totalTransactions}</p>
                  <div className="flex items-center mt-1 text-sm text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>{transactionsGrowth}% from last period</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            {/* Average Order Value Card */}
            <Card className="p-4 border-none bg-gradient-to-br from-orange-50 to-amber-50 shadow-sm transform hover:scale-[1.01] transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg. Order Value</p>
                  <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
                  <div className="flex items-center mt-1 text-sm text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>{aovGrowth}% from last period</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            {/* Customers Card */}
            <Card className="p-4 border-none bg-gradient-to-br from-green-50 to-teal-50 shadow-sm transform hover:scale-[1.01] transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Unique Customers</p>
                  <p className="text-2xl font-bold">{Math.floor(totalTransactions * 0.8)}</p>
                  <div className="flex items-center mt-1 text-sm text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>6.2% from last period</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Time Controls */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={timeframe === 'day' ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe('day')}
              className={timeframe === 'day' ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Daily
            </Button>
            <Button
              variant={timeframe === 'month' ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe('month')}
              className={timeframe === 'month' ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Monthly
            </Button>
            <Button
              variant={timeframe === 'year' ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe('year')}
              className={timeframe === 'year' ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Yearly
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const fetchData = async () => {
                  setIsLoading(true);
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
                  } finally {
                    setIsLoading(false);
                  }
                };
                fetchData();
              }}
              className="ml-auto"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Charts and Recent Sales Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[850px]">
          {/* Charts Section - Takes half of the space on larger screens */}
          <div className="space-y-6 h-full flex flex-col">
            <SalesChart data={salesData} />
            <SalesStats data={salesData} />
          </div>
          
          {/* Recent Sales Section - Takes half of the space on larger screens */}
          <div className="h-full">
            <RecentSales 
              sales={recentSales} 
              onLimitChange={handleLimitChange}
              currentLimit={salesLimit}
            />
          </div>
        </div>
      </main>
    </div>
  );
}