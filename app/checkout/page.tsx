import AddressForm from '@/components/AddressForm';

export default function CheckoutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:px-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-3 mb-8">
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
      
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">Checkout</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Shipping Information
        </h2>
        <AddressForm />
      </div>
    </div>
  );
}
