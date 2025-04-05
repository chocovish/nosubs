import { Card } from '@/components/ui/card';
import { type RecentSale } from '@/app/actions/sales';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingBag, User, Calendar, TrendingUp } from 'lucide-react';

interface RecentSalesProps {
  sales: RecentSale[];
  onLimitChange?: (limit: string) => void;
  currentLimit?: string;
}

const limitOptions = [
  { value: '5', label: 'Last 5 Sales' },
  { value: '10', label: 'Last 10 Sales' },
  { value: '20', label: 'Last 20 Sales' },
  { value: '50', label: 'Last 50 Sales' },
];

export function RecentSales({ sales, onLimitChange, currentLimit = '10' }: RecentSalesProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-none shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Recent Sales
          </h2>
        </div>
        <Select value={currentLimit} onValueChange={onLimitChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select limit" />
          </SelectTrigger>
          <SelectContent>
            {limitOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-md border border-purple-100 flex-grow overflow-hidden flex flex-col">
        <div className="overflow-auto flex-grow">
          <Table>
            <TableHeader className="bg-purple-50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="text-purple-900">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </div>
                </TableHead>
                <TableHead className="text-purple-900">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Product
                  </div>
                </TableHead>
                <TableHead className="text-purple-900">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Buyer
                  </div>
                </TableHead>
                <TableHead className="text-purple-900">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Amount
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id} className="hover:bg-purple-50/50 transition-colors">
                  <TableCell className="text-gray-600">
                    {new Date(sale.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{sale.productName}</TableCell>
                  <TableCell className="text-gray-600">{sale.buyerName}</TableCell>
                  <TableCell className="font-semibold text-purple-600">
                    ${sale.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
} 