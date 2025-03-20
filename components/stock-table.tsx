import { Stock } from '@/types/stock';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface StockTableProps {
  stocks: Stock[];
  onEdit: (stock: Stock) => void;
  onDelete: (id: number) => void;
}

export function StockTable({ stocks, onEdit, onDelete }: StockTableProps) {
  const calculateGainLoss = (stock: Stock) => {
    if (!stock.currentPrice) return 0;
    return ((stock.currentPrice - stock.buyPrice) / stock.buyPrice) * 100;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Ticker</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Buy Price</TableHead>
          <TableHead className="text-right">Current Price</TableHead>
          <TableHead className="text-right">Gain/Loss %</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stocks.map((stock) => (
          <TableRow key={stock.id}>
            <TableCell>{stock.name}</TableCell>
            <TableCell>{stock.ticker}</TableCell>
            <TableCell className="text-right">{stock.quantity}</TableCell>
            <TableCell className="text-right">${stock.buyPrice.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              ${stock.currentPrice?.toFixed(2) || 'N/A'}
            </TableCell>
            <TableCell className="text-right">
              <span
                className={
                  calculateGainLoss(stock) >= 0 ? 'text-green-700' : 'text-red-700'
                }
              >
                {calculateGainLoss(stock).toFixed(2)}%
              </span>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                title='update'
                onClick={() => onEdit(stock)}
                className="mr-2"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title='delete'
                onClick={() => onDelete(stock.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}