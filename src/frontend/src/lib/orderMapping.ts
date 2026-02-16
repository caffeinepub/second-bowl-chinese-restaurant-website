import { CartItem } from '@/cart/cartTypes';
import type { OrderItem, Address } from '@/backend';

// Map cart items to backend OrderItem format
export function mapCartItemsToOrderItems(cartItems: CartItem[]): OrderItem[] {
  return cartItems.map((item) => ({
    item: {
      id: BigInt(item.id.split('-').pop() || '0'), // Extract numeric id from string id
      name: item.name,
      price: BigInt(item.price), // Price in rupees as bigint
    },
    quantity: BigInt(item.quantity),
    total: BigInt(item.price * item.quantity), // Total in rupees as bigint
  }));
}

// Create Address object from form data
export function createAddress(
  name: string,
  phone: string,
  street: string,
  city: string,
  state: string,
  zip: string,
  country: string = 'Pakistan'
): Address {
  return {
    name,
    phone,
    street,
    city,
    state,
    zip,
    country,
  };
}
