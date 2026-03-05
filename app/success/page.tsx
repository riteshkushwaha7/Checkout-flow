'use client';

import Link from 'next/link';

export default function SuccessPage() {
  const orderNumber = `ECO-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Animation */}
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-10 h-10 text-emerald-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{
                animation: 'check 0.5s ease-out forwards',
              }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We have received your order and will process it shortly.
          </p>
          
          {/* Order Details Card */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Order Number</span>
              <span className="font-semibold text-gray-900">{orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estimated Delivery</span>
              <span className="font-medium text-gray-900">5-7 business days</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/cart"
              className="block w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
          
          {/* Support Info */}
          <p className="text-xs text-gray-500 mt-6">
            Need help? Contact us at{' '}
            <span className="text-emerald-600">support@ecoyaan.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
