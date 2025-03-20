import { Stock } from '@/types/stock';
import { PerformanceMetrics } from './performance';
import { PortfolioDistribution } from './portfolio-distribution';
import { TopPerformers } from './top-performers';

interface PortfolioMetricsProps {
  stocks: Stock[];
}

export function PortfolioMetrics({ stocks }: PortfolioMetricsProps) {
  return (
    <div className="space-y-6">
      <PerformanceMetrics stocks={stocks} />
      <div className="grid gap-6 md:grid-cols-2">
        <PortfolioDistribution stocks={stocks} />
        <TopPerformers stocks={stocks} />
      </div>
    </div>
  );
}