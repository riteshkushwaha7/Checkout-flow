'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { fetchCartData } from '@/lib/fetchCartData';
import { CartData } from '@/types/cart';
import { ShippingAddress } from '@/types/checkout';

export default function PaymentPage() {
  const router = useRouter();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [address, setAddress] = useState<ShippingAddress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCartData()
      .then(setCartData)
      .catch((err) => {
        console.error('Failed to load cart:', err);
        setError('Failed to load cart data');
      });
    
    const savedAddress = sessionStorage.getItem('shippingAddress');
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
    } else {
      router.push('/checkout');
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    sessionStorage.removeItem('shippingAddress');
    router.push('/success');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.refresh()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cartData || !address) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const { cartItems, shipping_fee, discount_applied } = cartData;
  const subtotal = cartItems.reduce((sum, item) => sum + item.product_price * item.quantity, 0);
  const grandTotal = subtotal + shipping_fee - discount_applied;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-6">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 text-white text-sm font-medium rounded-full">1</div>
        <span className="text-gray-400">→</span>
        <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 text-white text-sm font-medium rounded-full">2</div>
        <span className="text-gray-400">→</span>
        <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 text-white text-sm font-medium rounded-full">3</div>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">Payment</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                <p className="font-medium text-gray-900">{address.fullName}</p>
                <p className="mt-1">{address.email}</p>
                <p>{address.phone}</p>
                <p className="mt-1">{address.pinCode}, {address.city}, {address.state}</p>
              </div>
              <button type="button" onClick={() => router.push('/checkout')} className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                Change address
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === 'card' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="method" value="card" checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">Credit / Debit Card</span>
                  </div>
                  <span className="text-gray-400">💳</span>
                </label>
                
                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === 'upi' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="method" value="upi" checked={selectedMethod === 'upi'} onChange={() => setSelectedMethod('upi')} className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">UPI</span>
                  </div>
                  <span className="text-gray-400">📱</span>
                </label>
                
                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === 'cod' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="method" value="cod" checked={selectedMethod === 'cod'} onChange={() => setSelectedMethod('cod')} className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                  <span className="text-gray-400">💵</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={isProcessing} className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </>
              ) : (
                <>Pay ₹{grandTotal.toFixed(2)}</>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.product_id} className="flex gap-3">
                  <div className="relative w-14 h-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <Image src={item.image} alt={item.product_name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product_name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">₹{(item.product_price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-medium">₹{shipping_fee.toFixed(2)}</span></div>
              {discount_applied > 0 && <div className="flex justify-between"><span className="text-gray-600">Discount</span><span className="text-emerald-600 font-medium">-₹{discount_applied.toFixed(2)}</span></div>}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
