'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddressForm from '@/components/AddressForm';
import { ShippingAddressWithId } from '@/types/checkout';

const STORAGE_KEY = 'ecoyaan_saved_addresses';
const SELECTED_ADDRESS_KEY = 'ecoyaan_selected_address';

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddressWithId | null>(null);
  const [hasAddress, setHasAddress] = useState(false);

  useEffect(() => {
    // Load addresses from localStorage
    const savedAddresses = localStorage.getItem(STORAGE_KEY);
    if (savedAddresses) {
      const addresses = JSON.parse(savedAddresses) as ShippingAddressWithId[];
      setHasAddress(addresses.length > 0);
      
      // Get selected address
      const savedSelectedId = localStorage.getItem(SELECTED_ADDRESS_KEY);
      if (savedSelectedId) {
        const selected = addresses.find((addr: ShippingAddressWithId) => addr.id === savedSelectedId);
        if (selected) {
          setSelectedAddress(selected);
        }
      }
    }

    // Listen for address changes
    const handleStorageChange = () => {
      const updatedAddresses = localStorage.getItem(STORAGE_KEY);
      if (updatedAddresses) {
        const addresses = JSON.parse(updatedAddresses) as ShippingAddressWithId[];
        setHasAddress(addresses.length > 0);
        
        const savedSelectedId = localStorage.getItem(SELECTED_ADDRESS_KEY);
        if (savedSelectedId) {
          const selected = addresses.find((addr: ShippingAddressWithId) => addr.id === savedSelectedId);
          setSelectedAddress(selected || null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes in the same window
    const interval = setInterval(() => {
      const savedAddresses = localStorage.getItem(STORAGE_KEY);
      if (savedAddresses) {
        const addresses = JSON.parse(savedAddresses) as ShippingAddressWithId[];
        setHasAddress(addresses.length > 0);
        
        const savedSelectedId = localStorage.getItem(SELECTED_ADDRESS_KEY);
        if (savedSelectedId) {
          const selected = addresses.find((addr: ShippingAddressWithId) => addr.id === savedSelectedId);
          setSelectedAddress(selected || null);
        }
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleBack = () => {
    router.push('/cart');
  };

  const handleContinue = () => {
    if (selectedAddress) {
      sessionStorage.setItem('shippingAddress', JSON.stringify(selectedAddress));
      router.push('/payment');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 md:px-6">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 text-white text-sm font-medium rounded-full">
              1
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 text-white text-sm font-medium rounded-full">
              2
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-500 text-sm font-medium rounded-full">
              3
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 md:px-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Checkout</h1>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Shipping Information
          </h2>
          
          {/* Selected Address Preview */}
          {selectedAddress && (
            <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{selectedAddress.fullName}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedAddress.pinCode}, {selectedAddress.city}, {selectedAddress.state}
                  </p>
                  <p className="text-sm text-gray-500">{selectedAddress.phone}</p>
                </div>
              </div>
            </div>
          )}
          
          <AddressForm />
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 md:px-6">
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 py-3.5 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedAddress}
              className={`flex-1 py-3.5 px-4 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedAddress
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg hover:shadow-emerald-600/25 active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue to Payment
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

