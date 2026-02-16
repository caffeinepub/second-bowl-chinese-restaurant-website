// Cart domain types and utilities

export interface CartItem {
  id: string; // unique identifier for cart line (menuItemId or menuItemId-variant)
  name: string; // display name including variant if applicable
  price: number; // price in rupees (whole number)
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

// Calculate subtotal from cart items (in rupees)
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
