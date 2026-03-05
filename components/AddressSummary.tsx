import { ShippingAddress } from '@/types/checkout';

interface AddressSummaryProps {
  address: ShippingAddress;
}

export default function AddressSummary({ address }: AddressSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
      <div className="text-gray-900">
        <p className="font-medium">{address.fullName}</p>
        <p className="text-sm mt-1">{address.email}</p>
        <p className="text-sm">{address.phone}</p>
        <p className="text-sm mt-1">
          {address.pinCode}, {address.city}, {address.state}
        </p>
      </div>
    </div>
  );
}
