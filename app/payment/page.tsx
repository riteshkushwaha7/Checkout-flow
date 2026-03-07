'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { fetchCartData } from '@/lib/fetchCartData';
import { CartData } from '@/types/cart';
import { ShippingAddressWithId } from '@/types/checkout';

const STORAGE_KEY = 'ecoyaan_saved_addresses';
const SELECTED_ADDRESS_KEY = 'ecoyaan_selected_address';

export default function PaymentPage() {
  const router = useRouter();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [addresses, setAddresses] = useState<ShippingAddressWithId[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [address, setAddress] = useState<ShippingAddressWithId | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [error, setError] = useState<string | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    fetchCartData()
      .then(setCartData)
      .catch((err) => {
        console.error('Failed to load cart:', err);
        setError('Failed to load cart data');
      });
    
    // Load addresses from localStorage
    const savedAddresses = localStorage.getItem(STORAGE_KEY);
    if (savedAddresses) {
      const parsedAddresses = JSON.parse(savedAddresses) as ShippingAddressWithId[];
      setAddresses(parsedAddresses);
      
      const savedSelectedId = localStorage.getItem(SELECTED_ADDRESS_KEY);
      if (savedSelectedId) {
        const selected = parsedAddresses.find(addr => addr.id === savedSelectedId);
        if (selected) {
          setAddress(selected);
          setSelectedAddressId(selected.id);
        }
      }
    }
    
    // Fallback to sessionStorage
    const savedAddress = sessionStorage.getItem('shippingAddress');
    if (savedAddress && !address) {
      const parsed = JSON.parse(savedAddress);
      setAddress(parsed);
    } else if (!address && !savedAddresses) {
      router.push('/checkout');
    }
  }, [router]);

  const handleSelectAddress = (id: string) => {
    const selected = addresses.find(addr => addr.id === id);
    if (selected) {
      setAddress(selected);
      setSelectedAddressId(id);
      localStorage.setItem(SELECTED_ADDRESS_KEY, id);
      sessionStorage.setItem('shippingAddress', JSON.stringify(selected));
    }
    setShowAddressModal(false);
  };

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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 md:px-6">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 text-white text-sm font-medium rounded-full">1</div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 text-white text-sm font-medium rounded-full">2</div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 text-white text-sm font-medium rounded-full">3</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Payment</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{address.fullName}</p>
                    <p className="text-sm text-gray-600 mt-1">{address.email}</p>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">{address.pinCode}, {address.city}, {address.state}</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowAddressModal(true)}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === 'card' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="method" value="card" checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">Credit / Debit Card</span>
                  </div>
                  <span className="text-xl">💳</span>
                </label>
                
                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === 'upi' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="method" value="upi" checked={selectedMethod === 'upi'} onChange={() => setSelectedMethod('upi')} className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">UPI</span>
                  </div>
                  <span className="text-xl">📱</span>
                </label>
                
                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === 'cod' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="method" value="cod" checked={selectedMethod === 'cod'} onChange={() => setSelectedMethod('cod')} className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                  <span className="text-xl">💵</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
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

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 md:px-6">
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/checkout')}
              className="flex-1 py-3.5 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <button 
              type="submit" 
              form="payment-form"
              disabled={isProcessing}
              onClick={handleSubmit}
              className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-600/25 active:scale-[0.98]"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pay ₹{grandTotal.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Select Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => handleSelectAddress(addr.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAddressId === addr.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {selectedAddressId === addr.id && (
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{addr.fullName}</p>
                      <p className="text-sm text-gray-600">{addr.email}</p>
                      <p className="text-sm text-gray-600">{addr.phone}</p>
                      <p className="text-sm text-gray-600 mt-1">{addr.pinCode}, {addr.city}, {addr.state}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddressModal(false);
                  router.push('/checkout');
                }}
                className="w-full py-3 text-emerald-600 font-medium hover:bg-emerald-50 rounded-lg transition-colors"
              >
                Manage Addresses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

