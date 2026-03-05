import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const lineTotal = item.product_price * item.quantity;

  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="relative w-24 h-24 flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm">
        <Image
          src={item.image}
          alt={item.product_name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
            {item.product_name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            ₹{item.product_price.toFixed(2)} each
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Qty:</span>
            <span className="text-sm font-medium text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">
              {item.quantity}
            </span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            ₹{lineTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
