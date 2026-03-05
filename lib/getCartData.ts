import { CartData } from '@/types/cart';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser
    return '';
  }
  // Server - use the base URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

export async function getCartData(): Promise<CartData> {
  const baseUrl = getBaseUrl();
  const url = baseUrl ? `${baseUrl}/api/cart` : '/api/cart';
  
  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch cart data: ${res.status}`);
  }

  return res.json();
}
