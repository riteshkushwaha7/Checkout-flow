'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ShippingAddress, ShippingAddressWithId } from '@/types/checkout';

const STORAGE_KEY = 'ecoyaan_saved_addresses';
const SELECTED_ADDRESS_KEY = 'ecoyaan_selected_address';

export default function AddressForm() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<ShippingAddressWithId[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    pinCode: '',
    city: '',
    state: '',
  });

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  // Load addresses from localStorage on mount
  useEffect(() => {
    const savedAddresses = localStorage.getItem(STORAGE_KEY);
    if (savedAddresses) {
      const parsedAddresses = JSON.parse(savedAddresses) as ShippingAddressWithId[];
      setAddresses(parsedAddresses);
    }

    const savedSelectedId = localStorage.getItem(SELECTED_ADDRESS_KEY);
    if (savedSelectedId) {
      setSelectedAddressId(savedSelectedId);
    }
  }, []);

  // Save addresses to localStorage
  const saveAddressesToStorage = (newAddresses: ShippingAddressWithId[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAddresses));
  };

  // Save selected address to localStorage
  const saveSelectedAddress = (id: string | null) => {
    if (id) {
      localStorage.setItem(SELECTED_ADDRESS_KEY, id);
    } else {
      localStorage.removeItem(SELECTED_ADDRESS_KEY);
    }
    setSelectedAddressId(id);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }

    if (!formData.pinCode.trim()) {
      newErrors.pinCode = 'PIN code is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateId = (): string => {
    return 'addr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      if (editingAddressId) {
        // Update existing address
        const updatedAddresses = addresses.map(addr => 
          addr.id === editingAddressId ? { ...formData, id: editingAddressId } : addr
        );
        setAddresses(updatedAddresses);
        saveAddressesToStorage(updatedAddresses);
        setEditingAddressId(null);
      } else {
        // Add new address
        const newAddress: ShippingAddressWithId = {
          ...formData,
          id: generateId(),
        };
        const newAddresses = [...addresses, newAddress];
        setAddresses(newAddresses);
        saveAddressesToStorage(newAddresses);
        saveSelectedAddress(newAddress.id);
      }
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        pinCode: '',
        city: '',
        state: '',
      });
      setIsAddingNew(false);
    }
  };

  const handleEdit = (address: ShippingAddressWithId) => {
    setFormData({
      fullName: address.fullName,
      email: address.email,
      phone: address.phone,
      pinCode: address.pinCode,
      city: address.city,
      state: address.state,
    });
    setEditingAddressId(address.id);
    setIsAddingNew(true);
  };

  const handleDelete = (id: string) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    saveAddressesToStorage(updatedAddresses);
    
    if (selectedAddressId === id) {
      saveSelectedAddress(updatedAddresses.length > 0 ? updatedAddresses[0].id : null);
    }
  };

  const handleSelectAddress = (id: string) => {
    saveSelectedAddress(id);
  };

  const handleContinue = () => {
    if (selectedAddressId) {
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
      if (selectedAddress) {
        sessionStorage.setItem('shippingAddress', JSON.stringify(selectedAddress));
        router.push('/payment');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ShippingAddress]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const inputClasses = (field: keyof ShippingAddress) =>
    `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${
      errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
    }`;

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

  return (
    <div className="space-y-6">
      {/* Saved Addresses List */}
      {addresses.length > 0 && !isAddingNew && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Saved Addresses
          </h3>
          
          <div className="grid gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                onClick={() => handleSelectAddress(address.id)}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedAddressId === address.id
                    ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {selectedAddressId === address.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                <div className="pr-8">
                  <p className="font-semibold text-gray-900">{address.fullName}</p>
                  <p className="text-sm text-gray-600 mt-1">{address.email}</p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {address.pinCode}, {address.city}, {address.state}
                  </p>
                </div>
                
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(address);
                    }}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(address.id);
                    }}
                    className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add New Address Button */}
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl text-emerald-600 font-medium hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Address
          </button>
        </div>
      )}

      {/* Address Form */}
      {isAddingNew && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setEditingAddressId(null);
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  pinCode: '',
                  city: '',
                  state: '',
                });
                setErrors({});
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={inputClasses('fullName')}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses('email')}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  className={inputClasses('phone')}
                  placeholder="10-digit mobile number"
                />
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-1.5">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="pinCode"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                className={inputClasses('pinCode')}
                placeholder="Enter PIN code"
              />
              {errors.pinCode && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.pinCode}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClasses('city')}
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.city}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={inputClasses('state')}
                  placeholder="Enter state"
                />
                {errors.state && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.state}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingAddressId(null);
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    pinCode: '',
                    city: '',
                    state: '',
                  });
                  setErrors({});
                }}
                className="flex-1 py-3.5 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-600/25 active:scale-[0.98]"
              >
                {editingAddressId ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* No Addresses - Show Add Form Directly */}
      {addresses.length === 0 && !isAddingNew && (
        <button
          type="button"
          onClick={() => setIsAddingNew(true)}
          className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-all duration-200 flex flex-col items-center justify-center gap-2"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">Add your first address</span>
        </button>
      )}

      {/* Hidden continue button for parent component */}
      <div id="continue-button-container" style={{ display: 'none' }} data-selected-address={selectedAddress ? JSON.stringify(selectedAddress) : null}>
      </div>
    </div>
  );
}

