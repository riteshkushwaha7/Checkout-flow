import Image from 'next/image';
import { CartData } from '@/types/cart';
import { ShippingAddress } from '@/types/checkout';

interface PaymentSummaryProps {
  cartData: CartData;
  shippingAddress: ShippingAddress;
}

export default function PaymentSummary({ cartData, shippingAddress }: PaymentSummaryProps) {
  const { cartItems, shipping_fee, discount_applied } = cartData;
  
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );
  const grandTotal = subtotal + shipping_fee - discount_applied;

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Order Items</h3>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.product_id} className="flex gap-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.product_name}
                  fill
                  className="object-cover rounded-md"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.product_name}
                </p>
                <p className="text-xs text-gray-500">
                  ₹{item.product_price} × {item.quantity}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  ₹{(item.product_price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
        <div className="text-gray-900">
          <p className="font-medium">{shippingAddress.fullName}</p>
          <p className="text-sm mt-1">{shippingAddress.email}</p>
          <p className="text-sm">{shippingAddress.phone}</p>
          <p className="text-sm mt-1">
            {shippingAddress.pinCode}, {shippingAddress.city}, {shippingAddress.state}
          </p>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Price Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900 font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900 font-medium">₹{shipping_fee.toFixed(2)}</span>
          </div>
          {discount_applied > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="text-emerald-600 font-medium">-₹{discount_applied.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Grand Total</span>
              <span className="font-bold text-gray-900">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
