import { Stock } from '@/types/stock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';

interface PerformanceMetricsProps {
  stocks: Stock[];
}

export function PerformanceMetrics({ stocks }: PerformanceMetricsProps) {
  const totalValue = stocks.reduce((sum, stock) => {
    return sum + (stock.currentPrice || stock.buyPrice) * stock.quantity;
  }, 0);

  const totalInvestment = stocks.reduce((sum, stock) => {
    return sum + stock.buyPrice * stock.quantity;
  }, 0);

  const totalGainLoss = stocks.reduce((sum, stock) => {
    if (!stock.currentPrice) return sum;
    return sum + (stock.currentPrice - stock.buyPrice) * stock.quantity;
  }, 0);

  const percentageReturn = (totalGainLoss / totalInvestment) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Current portfolio value</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalInvestment.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Initial investment</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
          {totalGainLoss >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-700" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-700" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            ${Math.abs(totalGainLoss).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Absolute gain/loss</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Return %</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${percentageReturn >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {percentageReturn.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">Total return percentage</p>
        </CardContent>
      </Card>
    </div>
  );
}