import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CoinScope - Crypto Dashboard",
  description: "A simple cryptocurrency dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full bg-gray-50`}>
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-8">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  🪙 CoinScope
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Markets
                  </Link>
                  <Link
                    href="/watchlist"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Watchlist
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-8">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>Built with ❤️ using CoinGecko API</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
