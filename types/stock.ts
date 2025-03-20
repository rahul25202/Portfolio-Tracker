export interface Stock {
  id: number;
  name: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

export interface StockFormData {
  name: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
}