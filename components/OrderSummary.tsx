import Link from 'next/link';
import { CartItem as CartItemType } from '@/types/cart';

interface OrderSummaryProps {
  cartItems: CartItemType[];
  shippingFee: number;
  discount: number;
}

export default function OrderSummary({
  cartItems,
  shippingFee,
  discount,
}: OrderSummaryProps) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );
  const grandTotal = subtotal + shippingFee - discount;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
          <span className="text-gray-900 font-medium">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900 font-medium">
            ₹{shippingFee.toFixed(2)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Discount</span>
            <span className="text-emerald-600 font-medium">
              -₹{discount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900">
              Grand Total
            </span>
            <div className="text-right">
              <span className="text-xl font-bold text-gray-900">
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/checkout"
        className="block w-full mt-6 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-center rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-600/25"
      >
        Proceed to Checkout
      </Link>
      
      <p className="text-xs text-gray-500 text-center mt-3">
        Secure checkout powered by Ecoyaan
      </p>
    </div>
  );
}
