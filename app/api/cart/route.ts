import { NextResponse } from 'next/server';
import { CartData } from '@/types/cart';

const mockCartData: CartData = {
  cartItems: [
    {
      product_id: 101,
      product_name: 'Bamboo Toothbrush (Pack of 4)',
      product_price: 299,
      quantity: 2,
      image: 'https://picsum.photos/seed/toothbrush/150/150',
    },
    {
      product_id: 102,
      product_name: 'Reusable Cotton Produce Bags',
      product_price: 450,
      quantity: 1,
      image: 'https://picsum.photos/seed/bags/150/150',
    },
  ],
  shipping_fee: 50,
  discount_applied: 0,
};

export async function GET() {
  return NextResponse.json(mockCartData);
}
