# Ecoyaan Checkout Flow

A production-quality Next.js checkout flow with Server-Side Rendering (SSR), responsive UI, and clean code architecture.

## 🌿 Project Overview

Ecoyaan is an eco-friendly e-commerce checkout demonstration featuring a complete flow from cart to payment to success confirmation. The project showcases modern Next.js 14+ patterns with App Router, TypeScript, and Tailwind CSS.

## 🛠 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Rendering**: Server-Side Rendering (SSR) with Server Components
- **State**: React hooks + sessionStorage for persistence

## 📁 Project Structure

```
ecoyaan-checkout-flow/
├── app/
│   ├── api/cart/route.ts     # Mock API endpoint
│   ├── cart/page.tsx         # Cart page (Server Component)
│   ├── checkout/page.tsx    # Shipping address form
│   ├── payment/page.tsx     # Payment page with processing
│   ├── success/page.tsx      # Order confirmation
│   ├── layout.tsx            # Root layout with header/footer
│   └── page.tsx              # Home redirect
├── components/
│   ├── CartItem.tsx          # Individual cart item
│   ├── OrderSummary.tsx      # Price calculations & checkout button
│   ├── AddressForm.tsx       # Shipping form with validation
│   └── ...
├── types/
│   ├── cart.ts               # Cart type definitions
│   └── checkout.ts           # Shipping address types
├── lib/
│   └── getCartData.ts        # Server-side data fetching
└── public/
```

## 🎯 Key Features

### 1. Server-Side Rendering (SSR)
- Cart data fetched on server using Next.js Server Components
- SEO-friendly and fast initial page loads
- Proper loading and error states

### 2. Complete Checkout Flow
- **Cart Page** (`/cart`): Display cart items with images, prices, quantities
- **Checkout Page** (`/checkout`): Shipping address form with validation
- **Payment Page** (`/payment`): Payment method selection with loading state
- **Success Page** (`/success`): Order confirmation with animation

### 3. Form Validation
- Email format validation
- Phone number (10 digits required)
- Required field validation
- Real-time error clearing

### 4. Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Sticky order summary on desktop

### 5. UX Improvements
- Progress stepper showing checkout stages
- Loading spinner during payment processing
- Error states with retry options
- Empty cart state handling
- Success animation on order completion

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```
bash
# Clone the repository
cd ecoyaan-checkout-flow

# Install dependencies
npm install
```

### Development Server

```
bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```
bash
npm run build
npm start
```

## 📱 API Endpoints

### GET /api/cart

Returns cart data with products, shipping fee, and discount.

**Response:**
```
json
{
  "cartItems": [
    {
      "product_id": 101,
      "product_name": "Bamboo Toothbrush (Pack of 4)",
      "product_price": 299,
      "quantity": 2,
      "image": "https://picsum.photos/seed/toothbrush/150/150"
    }
  ],
  "shipping_fee": 50,
  "discount_applied": 0
}
```

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env.local` file for any custom configuration:

```
env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Tailwind Configuration

The project uses Tailwind CSS with custom colors:
- Primary: Emerald-600 (#059669)
- Background: Gray-50 (#F9FAFB)
- Cards: White with gray-200 borders

## 📤 Deploy on Vercel

The easiest way to deploy is using Vercel:

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import the repository
4. Deploy with one click!

```
bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

## 🎨 Design Decisions

### Why Server Components?
- Better performance for initial data fetching
- Reduced client-side JavaScript
- Improved SEO

### Why sessionStorage?
- Simple state persistence without backend
- Automatically clears on tab close
- Perfect for checkout flow

### Why Tailwind?
- Utility-first for rapid development
- Consistent design system
- Small bundle size (purged in production)

## 📄 License

MIT License - feel free to use for learning or as a starting point for your own projects.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [picsum.photos](https://picsum.photos) for placeholder images
