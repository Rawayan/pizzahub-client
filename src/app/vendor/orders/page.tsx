import type { Metadata } from "next";

import VendorOrders from "@/src/components/vendor/vendor-orders";

export const metadata: Metadata = {
  title: "Customer Orders",
  description:
    "Review and manage customer orders for your restaurant on PizzaHub.",
};

export default function VendorOrdersPage() {
  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <VendorOrders />
    </div>
  );
}