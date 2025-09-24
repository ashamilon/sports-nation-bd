import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { CartProvider } from "@/components/cart-provider";
import { WishlistProvider } from "@/components/wishlist-provider";
import { RegionalProvider } from "@/components/regional-provider";
import AuthSessionProvider from "@/components/session-provider";
import { LoadingProvider } from "@/lib/loading-context";
import LoadingOverlay from "@/components/loading-overlay";
import WhatsAppButton from "@/components/whatsapp-button";
import VisitorTracking from "@/components/visitor-tracking";
import RealtimeUpdates from "@/components/realtime-updates";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ImagePreloader from "@/components/image-preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

// Add Freckle Face font
const freckleFace = {
  variable: "--font-freckle-face",
  className: "freckle-face-regular",
};

export const metadata: Metadata = {
  title: "Sports Nation BD - Buy Your Dream Here",
  description: "Shop premium sports gear, Naviforce watches, sneakers, and custom club jerseys. Fan and player versions available with custom badges, names, and numbers.",
  keywords: "sports gear, jerseys, watches, sneakers, football, basketball, custom jerseys, Bangladesh",
  authors: [{ name: "Sports Nation BD" }],
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
  openGraph: {
    title: "Sports Nation BD - Buy Your Dream Here",
    description: "Shop premium sports gear, Naviforce watches, sneakers, and custom club jerseys.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Sports Nation BD Logo',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Freckle+Face&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} antialiased`}
      >
        <AuthSessionProvider>
          <ThemeProvider
            defaultTheme="system"
            storageKey="sports-nation-theme"
          >
            <LoadingProvider>
              <CartProvider>
                <WishlistProvider>
                  <RegionalProvider>
                    {children}
                    <LoadingOverlay />
                    <WhatsAppButton />
                    <VisitorTracking />
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: 'var(--background)',
                          color: 'var(--foreground)',
                          border: '1px solid var(--border)',
                        },
                      }}
                    />
                    <RealtimeUpdates />
                    <SpeedInsights />
                    <ImagePreloader />
                  </RegionalProvider>
                </WishlistProvider>
              </CartProvider>
            </LoadingProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
