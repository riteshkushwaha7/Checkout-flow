export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  pinCode: string;
  city: string;
  state: string;
}

export interface ShippingAddressWithId extends ShippingAddress {
  id: string;
}

export interface CheckoutState {
  cartData: import('./cart').CartData | null;
  shippingAddress: ShippingAddress | null;
}
