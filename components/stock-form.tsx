'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { searchStockSymbols } from '@/lib/api';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Stock } from '@/types/stock';

const formSchema = z.object({
  name: z.string().min(2, 'Stock name must be at least 2 characters'),
  ticker: z.string().min(1, 'Ticker symbol is required').toUpperCase(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  buyPrice: z.number().positive('Buy price must be positive'),
});

interface StockFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  initialData?: Stock;
}

export function StockForm({ onSubmit, initialData }: StockFormProps) {
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ symbol: string; name: string }>>([]);
  const [searchValue, setSearchValue] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      ticker: '',
      quantity: 1,
      buyPrice: 0,
    },
  });

  useEffect(() => {
    const searchSymbols = async () => {
      if (searchValue.length >= 2) {
        const results = await searchStockSymbols(searchValue);
        setSearchResults(results);
      }
    };

    const timeoutId = setTimeout(searchSymbols, 300);
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 ">
        <FormField
          control={form.control}
          name="ticker"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticker Symbol</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {field.value
                        ? searchResults.find((result) => result.symbol === field.value)?.symbol || field.value
                        : "Select stock..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command className='bg-black text-white'>
                    <CommandInput
                      placeholder="Search stock symbol..."
                      value={searchValue}
                      onValueChange={setSearchValue}
                    />
                    <CommandEmpty>No stock found.</CommandEmpty>
                    <CommandGroup>
                      {searchResults.map((result) => (
                        <CommandItem
                          key={result.symbol}
                          value={result.symbol}
                          onSelect={() => {
                            form.setValue('ticker', result.symbol);
                            form.setValue('name', result.name);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === result.symbol ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {result.symbol} - {result.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="buyPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buy Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className='bg-black text-white hover:bg-gray-600' type="submit">Save Stock</Button>
      </form>
    </Form>
  );
}