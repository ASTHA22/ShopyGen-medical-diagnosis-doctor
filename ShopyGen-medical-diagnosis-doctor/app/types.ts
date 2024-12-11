export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    emoji: string;
    quantity?: number;
}
  
export interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  emoji: string;
  quantity?: number;
}