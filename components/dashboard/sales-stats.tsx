import { Card } from '@/components/ui/card';
import { type SaleData } from '@/app/actions/sales';
import { DollarSign, Activity, TrendingUp, Calendar, Users } from 'lucide-react';

interface SalesStatsProps {
  data: SaleData[];
}

export function SalesStats({ data }: SalesStatsProps) {
  const totalSales = data.reduce((sum, sale) => sum + sale.amount, 0);
  const averageSale = data.length > 0 ? totalSales / data.length : 0;
  const totalTransactions = data.reduce((t, sale) => t + sale.transactions, 0);
  
  // Example helper functions to get more stats
  const getHighestSalesDay = () => {
    if (data.length === 0) return { date: 'N/A', amount: 0 };
    return data.reduce((max, sale) => 
      max.amount > sale.amount ? max : { date: sale.date, amount: sale.amount }, 
      { date: '', amount: 0 }
    );
  };
  
  const getAverageTransactionsPerDay = () => {
    return data.length > 0 ? totalTransactions / data.length : 0;
  };
  
  const highestDay = getHighestSalesDay();
  const avgTransPerDay = getAverageTransactionsPerDay();

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-purple-50/30 border-none shadow-md flex-grow">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Sales Statistics</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm transform hover:scale-[1.01] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-700">Total Revenue</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">${totalSales.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">All time sales revenue</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm transform hover:scale-[1.01] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-700">Average Sale</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">${averageSale.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Average revenue per sale</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm transform hover:scale-[1.01] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-700">Best Sales Day</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">${highestDay.amount.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">{highestDay.date}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm transform hover:scale-[1.01] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-full">
              <Users className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="font-medium text-gray-700">Daily Transactions</h3>
          </div>
          <p className="text-2xl font-bold text-orange-600">{avgTransPerDay.toFixed(1)}</p>
          <p className="text-sm text-gray-500 mt-1">Average transactions per day</p>
        </div>
      </div>
    </Card>
  );
} 