
import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/src/components/layout/navbar";
import Footer from "@/src/components/layout/footer";

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
        <Navbar />

        <div className="flex flex-1 flex-col">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}
