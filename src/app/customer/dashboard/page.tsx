import type { Metadata } from "next";
import CustomerOverview from "@/src/components/customer/customer-overview";

export const metadata: Metadata = {
  title: "Customer Dashboard",
  description: "View your PizzaHub order statistics and activity.",
};

export default function CustomerDashboardPage() {
  return <CustomerOverview />;
}