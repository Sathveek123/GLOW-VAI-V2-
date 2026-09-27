import { create } from 'zustand';

export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  mrp?: number;
  quantity: number;
}

interface CartState {
  items: Record<string, CartItem>;
  totalCount: number;
  totalPrice: number;
  mrpTotal: number;
  savings: number;

  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

function recompute(items: Record<string, CartItem>) {
  const values = Object.values(items);
  const totalCount = values.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = values.reduce((sum, i) => sum + i.quantity * i.price, 0);
  const mrpTotal = values.reduce((sum, i) => sum + i.quantity * (i.mrp ?? i.price), 0);
  const savings = Math.max(0, mrpTotal - totalPrice);
  return { totalCount, totalPrice, mrpTotal, savings };
}

export const useCartStore = create<CartState>((set, get) => ({
  items: {
    'prod-01': {
      productId: 'prod-01',
      name: 'Minimalist 10% Niacinamide Serum',
      brand: 'Minimalist',
      image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80',
      price: 599,
      mrp: 699,
      quantity: 1,
    },
  },
  totalCount: 1,
  totalPrice: 599,
  mrpTotal: 699,
  savings: 100,

  addItem: (item) => {
    const items = { ...get().items };
    const existing = items[item.productId];
    items[item.productId] = {
      ...item,
      quantity: (existing?.quantity ?? 0) + 1,
    };
    set({ items, ...recompute(items) });
  },

  incrementItem: (productId) => {
    const items = { ...get().items };
    const target = items[productId];
    if (!target) return;
    items[productId] = { ...target, quantity: target.quantity + 1 };
    set({ items, ...recompute(items) });
  },

  decrementItem: (productId) => {
    const items = { ...get().items };
    const target = items[productId];
    if (!target) return;
    if (target.quantity <= 1) {
      delete items[productId];
    } else {
      items[productId] = { ...target, quantity: target.quantity - 1 };
    }
    set({ items, ...recompute(items) });
  },

  removeItem: (productId) => {
    const items = { ...get().items };
    delete items[productId];
    set({ items, ...recompute(items) });
  },

  clearCart: () => set({ items: {}, totalCount: 0, totalPrice: 0, mrpTotal: 0, savings: 0 }),
}));
