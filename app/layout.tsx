import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ecoyaan - Eco-Friendly Products",
  description: "Your cart - Sustainable shopping for a better planet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900`}
      >
        {/* Simple Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-xl font-bold text-emerald-600">
              🌿 Ecoyaan
            </h1>
          </div>
        </header>
        
        <main>{children}</main>
        
        {/* Simple Footer */}
        <footer className="border-t border-gray-200 mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Ecoyaan. Sustainable shopping for a better planet.
          </div>
        </footer>
      </body>
    </html>
  );
}
