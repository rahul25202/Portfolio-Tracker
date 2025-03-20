'use client';

import { useState, useEffect, useCallback } from 'react';
import { Stock } from '@/types/stock';
import { StockForm } from '@/components/stock-form';
import { StockTable } from '@/components/stock-table';
import { PortfolioMetrics } from '@/components/portfolio-matrics';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { fetchStocks, createStock, updateStock, deleteStock } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadStocks = useCallback(async () => {
    try {
      const data = await fetchStocks();
      setStocks(data);
    } catch (_error) {
      console.log(_error);
      toast({
        title: 'Error',
        description: 'Failed to fetch stocks',
        variant: 'destructive',
      });
    }
  }, [toast]);

  useEffect(() => {
    loadStocks();
    const interval = setInterval(loadStocks, 60000);
    return () => clearInterval(interval);
  }, [loadStocks]);

  const handleSubmit = async (data: Omit<Stock, 'id' | 'currentPrice'>) => {
    try {
      if (editingStock) {
        await updateStock(editingStock.id, data);
      } else {
        await createStock(data);
      }
      setIsDialogOpen(false);
      setEditingStock(null);
      loadStocks();
      toast({
        title: 'Success',
        description: `Stock ${editingStock ? 'updated' : 'added'} successfully`,
      });
    } catch (_error) {
      console.log(_error);
      toast({
        title: 'Error',
        description: `Failed to ${editingStock ? 'update' : 'add'} stock`,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (stock: Stock) => {
    setEditingStock(stock);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteStock(id);
      loadStocks();
      toast({
        title: 'Success',
        description: 'Stock deleted successfully',
      });
    } catch (_error) {
      console.log(_error);
      toast({
        title: 'Error',
        description: 'Failed to delete stock',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8 p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Portfolio Manager</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className='bg-black text-white hover:bg-gray-600'>
              <Plus className="mr-2 h-4 w-4" />
              Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent className='bg-white text-black'>
            <DialogHeader>
              <DialogTitle>
                {editingStock ? 'Edit Stock' : 'Add New Stock'}
              </DialogTitle>
            </DialogHeader>
            <StockForm
              onSubmit={handleSubmit}
              initialData={editingStock || undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      <PortfolioMetrics stocks={stocks} />

      <div className="rounded-lg border bg-card">
        <StockTable
          stocks={stocks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
