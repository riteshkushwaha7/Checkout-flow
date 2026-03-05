# Ecoyaan Checkout Flow - Cart Page Specification

## 1. Project Overview

- **Project Name**: Ecoyaan Checkout Flow
- **Type**: E-commerce Cart/Checkout Module
- **Core Functionality**: Display cart items with order summary using Server-Side Rendering
- **Target Users**: E-commerce customers reviewing their cart before checkout

## 2. Technical Stack

- Next.js 14+ with App Router
- React 18+
- TypeScript
- Tailwind CSS
- Server Components for SSR
- Local mock API using Next.js Route Handlers

## 3. UI/UX Specification

### Layout Structure

**Mobile First (Default)**
- Single column layout
- Cart items stacked vertically
- Order summary below cart items
- Full-width buttons

**Desktop (md: 768px+)**
- Two-column layout
- Cart items on left (60%)
- Order summary on right (40%)
- Sticky order summary

### Visual Design

**Color Palette**
- Background: `#F9FAFB` (gray-50)
- Card Background: `#FFFFFF` (white)
- Primary Text: `#111827` (gray-900)
- Secondary Text: `#6B7280` (gray-500)
- Accent/Primary: `#059669` (emerald-600) - Eco-friendly theme
- Accent Hover: `#047857` (emerald-700)
- Border: `#E5E7EB` (gray-200)
- Success: `#10B981` (emerald-500)

**Typography**
- Font Family: System UI (Tailwind default)
- Heading (Page Title): 24px, font-weight 700
- Product Name: 16px, font-weight 500
- Price: 16px, font-weight 600
- Labels: 14px, font-weight 500
- Small Text: 12px, font-weight 400

**Spacing**
- Container Padding: 16px (mobile), 24px (desktop)
- Card Padding: 16px
- Gap between items: 16px
- Section gap: 24px

### Components

**1. CartItem Component**
- Product image (80x80px, rounded)
- Product name (truncate if long)
- Price per unit
- Quantity display
- Line total (price × quantity)
- Remove button (icon)

**2. OrderSummary Component**
- Subtotal row
- Shipping fee row
- Discount row (if any)
- Divider
- Grand total (bold, larger)
- "Proceed to Checkout" button

**3. CartPage (Server Component)**
- Page title "Your Cart"
- Cart items list
- Order summary
- Empty state (if no items)

## 4. Functionality Specification

### Core Features

1. **Server-Side Data Fetching**
   - Fetch cart data on server using Server Component
   - Use Next.js `fetch` with caching for API call
   - Handle loading/error states

2. **Cart Display**
   - Show all cart items from API
   - Display product image, name, price, quantity
   - Calculate and show line total for each item

3. **Order Summary Calculation**
   - Subtotal: Sum of (price × quantity) for all items
   - Shipping: Flat fee from API (₹50)
   - Discount: From API (default 0)
   - Grand Total: Subtotal + Shipping - Discount

4. **Navigation**
   - "Proceed to Checkout" button links to `/checkout`

### Mock Data Structure

```
json
{
  "cartItems": [
    {
      "product_id": 101,
      "product_name": "Bamboo Toothbrush (Pack of 4)",
      "product_price": 299,
      "quantity": 2,
      "image": "https://via.placeholder.com/150"
    }
  ],
  "shipping_fee": 50,
  "discount_applied": 0
}
```

### Edge Cases
- Empty cart: Show "Your cart is empty" message
- API error: Show error message with retry option

## 5. Project Structure

```
/app
  /cart
    page.tsx          - Cart page (Server Component)
  /api
    /cart
      route.ts        - Mock API endpoint
  layout.tsx          - Root layout
  page.tsx            - Home page redirecting to cart
/types
  cart.ts             - TypeScript types
/components
  CartItem.tsx        - Cart item component
  OrderSummary.tsx    - Order summary component
/lib
  getCartData.ts      - Server-side data fetching function
```

## 6. Acceptance Criteria

1. ✅ Page loads with SSR data from mock API
2. ✅ All cart items display with correct information
3. ✅ Order summary shows correct calculations
4. ✅ Responsive layout works on mobile and desktop
5. ✅ "Proceed to Checkout" button navigates to /checkout
6. ✅ Clean, modern UI with Tailwind
7. ✅ Proper TypeScript types throughout
8. ✅ Server Component used for data fetching
