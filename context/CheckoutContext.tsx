'use client';

import { createContext, useContext, ReactNode } from 'react';
import { CartData } from '@/types/cart';
import { ShippingAddress } from '@/types/checkout';

interface CheckoutContextType {
  cartData: CartData | null;
  shippingAddress: ShippingAddress | null;
  setCartData: (data: CartData) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  clearCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const cartData: CartData | null = null;
  const shippingAddress: ShippingAddress | null = null;

  const setCartData = (_data: CartData) => {
    // This would typically update state, but for SSR we'll pass data via props
  };

  const setShippingAddress = (_address: ShippingAddress) => {
    // This would typically update state, but for SSR we'll pass data via props
  };

  const clearCheckout = () => {
    // Clear checkout state
  };

  return (
    <CheckoutContext.Provider
      value={{
        cartData,
        shippingAddress,
        setCartData,
        setShippingAddress,
        clearCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
