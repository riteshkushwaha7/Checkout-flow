import { getCartData } from '@/lib/getCartData';
import CartItem from '@/components/CartItem';
import OrderSummary from '@/components/OrderSummary';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  let cartData;
  
  try {
    cartData = await getCartData();
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load cart
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn't fetch your cart data. Please try again.
          </p>
          <a 
            href="/cart" 
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </a>
        </div>
      </div>
    );
  }

  if (!cartData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No cart data available
          </h2>
          <a href="/cart" className="text-emerald-600 hover:text-emerald-700">
            Retry
          </a>
        </div>
      </div>
    );
  }

  const { cartItems, shipping_fee, discount_applied } = cartData;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:px-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 text-white text-sm font-medium rounded-full">
          1
        </div>
        <span className="text-gray-400">→</span>
        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-500 text-sm font-medium rounded-full">
          2
        </div>
        <span className="text-gray-400">→</span>
        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-500 text-sm font-medium rounded-full">
          3
        </div>
        <h1 className="text-2xl font-bold text-gray-900 ml-3">Your Cart</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Cart Items ({cartItems.length})
            </h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.product_id} item={item} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <OrderSummary
              cartItems={cartItems}
              shippingFee={shipping_fee}
              discount={discount_applied}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
