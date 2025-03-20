import { Stock, StockFormData } from '@/types/stock';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function searchStockSymbols(query: string): Promise<Array<{ symbol: string, name: string }>> {
  try {
    const response = await fetch(`${API_URL}/api/stocks/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search stocks');
    return response.json();
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
}

export async function fetchStocks(): Promise<Stock[]> {
  try {
    const response = await fetch(`${API_URL}/api/stocks`);
    if (!response.ok) throw new Error('Failed to fetch stocks');
    return response.json();
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
}

export async function createStock(data: StockFormData): Promise<{ id: number }> {
  try {
    const response = await fetch(`${API_URL}/api/stocks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create stock');
    return response.json();
  } catch (error) {
    console.error('Error creating stock:', error);
    throw error;
  }
}

export async function updateStock(id: number, data: StockFormData): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/stocks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update stock');
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
}

export async function deleteStock(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/stocks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete stock');
  } catch (error) {
    console.error('Error deleting stock:', error);
    throw error;
  }
}