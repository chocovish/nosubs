import { Card } from '@/components/ui/card';
import { type SaleData } from '@/app/actions/sales';

interface SalesStatsProps {
  data: SaleData[];
}

export function SalesStats({ data }: SalesStatsProps) {
  const totalSales = data.reduce((sum, sale) => sum + sale.amount, 0);
  const averageSale = data.length > 0 ? totalSales / data.length : 0;
  const totalTransactions = data.reduce((t, sale) => t + sale.transactions, 0);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Sales Statistics</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">Average Sale</p>
          <p className="text-2xl font-bold">${averageSale.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">Total Transactions</p>
          <p className="text-2xl font-bold">{totalTransactions}</p>
        </div>
      </div>
    </Card>
  );
} 