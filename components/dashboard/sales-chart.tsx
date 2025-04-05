import { Card } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { type SaleData } from '@/app/actions/sales';
import { TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SalesChartProps {
  data: SaleData[];
}

export function SalesChart({ data }: SalesChartProps) {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-blue-50/30 border-none shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Sales Overview</h2>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={chartType === 'area' ? 'default' : 'outline'}
            onClick={() => setChartType('area')}
            className={chartType === 'area' ? "bg-gradient-to-r from-blue-600 to-indigo-600" : ""}
          >
            Area
          </Button>
          <Button 
            size="sm" 
            variant={chartType === 'bar' ? 'default' : 'outline'}
            onClick={() => setChartType('bar')}
            className={chartType === 'bar' ? "bg-gradient-to-r from-blue-600 to-indigo-600" : ""}
          >
            Bar
          </Button>
        </div>
      </div>
      
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: 'none'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#4b5563' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="amount" 
                name="Sales Amount ($)" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorSales)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="transactions" 
                name="Transactions" 
                stroke="#8b5cf6" 
                fillOpacity={1} 
                fill="url(#colorTransactions)" 
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: 'none'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#4b5563' }}
              />
              <Legend />
              <Bar 
                dataKey="amount" 
                name="Sales Amount ($)" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="transactions" 
                name="Transactions" 
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 