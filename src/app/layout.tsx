
import type { Metadata } from "next";
import { Suspense } from "react";

import "./globals.css";

import Navbar from "@/src/components/layout/navbar";
import Footer from "@/src/components/layout/footer";
import ThemeProvider from "@/src/components/providers/theme-provider";

import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "PizzaHub | Fresh Pizza Delivered",
    template: "%s | PizzaHub",
  },

  description:
    "Discover delicious pizzas, explore local restaurants, and enjoy fresh pizza delivered to your door with PizzaHub.",

  applicationName: "PizzaHub",

  keywords: [
    "PizzaHub",
    "Pizza Ordering",
    "Pizza Delivery",
    "Restaurants",
    "Online Food Ordering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <div className="site-backdrop" aria-hidden="true" />

        <ThemeProvider>
          <div className="site-content flex flex-1 flex-col">
            <Suspense
              fallback={
                <div className="h-16 border-b border-border bg-card/95 lg:h-20" />
              }
            >
              <Navbar />
            </Suspense>

            <div className="flex flex-1 flex-col">
              {children}
            </div>

            <Footer />
          </div>

          <Toaster
            position="top-right"
            richColors
            closeButton
            theme="system"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
