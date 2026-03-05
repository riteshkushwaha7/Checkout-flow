'use client';

import { CartData } from '@/types/cart';

export async function fetchCartData(): Promise<CartData> {
  const res = await fetch('/api/cart', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch cart data: ${res.status}`);
  }

  return res.json();
}
