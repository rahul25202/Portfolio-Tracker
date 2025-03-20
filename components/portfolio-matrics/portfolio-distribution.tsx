import { Stock } from '@/types/stock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface PortfolioDistributionProps {
  stocks: Stock[];
}

export function PortfolioDistribution({ stocks }: PortfolioDistributionProps) {
  const pieChartData = stocks.map((stock) => ({
    name: stock.ticker,
    value: (stock.currentPrice || stock.buyPrice) * stock.quantity,
  }));

  const generateDynamicColors = (numColors: number) => {
    const hueStep = 360 / numColors;
    const baseSaturation = 70, baseLightness = 20;
    const saturationStep = 10, lightnessStep = 5;
  
    return Array.from({ length: numColors }, (_, i) => {
      const hue = (i * hueStep) % 360;
      const saturation = Math.min(baseSaturation + i * saturationStep, 100);
      const lightness = Math.min(baseLightness + i * lightnessStep, 100);
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });
  };
  
  
  const COLORS = generateDynamicColors(stocks.length);
  

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Portfolio Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              label={({ name }) => `${name}`}
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}