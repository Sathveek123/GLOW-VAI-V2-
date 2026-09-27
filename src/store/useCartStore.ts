import { useCartStore as useZustandCartStore, CartItem } from '../state/cartStore';

export interface CartItemData {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  qty: number;
  image?: any;
  size?: string;
  customization?: string;
}

export function useCartStore() {
  const store = useZustandCartStore();

  // Legacy key mapping for backward compatibility across screens
  const cartLegacy: Record<string, number> = {};
  Object.values(store.items).forEach((item) => {
    cartLegacy[item.productId] = item.quantity;
  });

  return {
    cart: cartLegacy,
    items: cartLegacy,
    cartItemsMap: store.items,
    totalCount: store.totalCount,
    totalPrice: store.totalPrice,
    mrpTotal: store.mrpTotal,
    savings: store.savings,
    addToCart: (productId: string, qty: number = 1) => {
      for (let i = 0; i < (qty || 1); i++) {
        store.addItem({
          productId,
          name: 'Clinical Product',
          brand: 'GlowVAI',
          image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80',
          price: 499,
          mrp: 599,
        });
      }
    },
    updateQty: (productId: string, delta: number = 1) => {
      if (delta > 0) {
        for (let i = 0; i < delta; i++) store.incrementItem(productId);
      } else {
        for (let i = 0; i < Math.abs(delta); i++) store.decrementItem(productId);
      }
    },
    incrementQuantity: (productId: string) => store.incrementItem(productId),
    decrementQuantity: (productId: string) => store.decrementItem(productId),
    removeFromCart: (productId: string) => store.removeItem(productId),
    clearCart: () => store.clearCart(),
    getTotalPrice: () => store.totalPrice,
  };
}

export { useZustandCartStore };
export default useCartStore;
