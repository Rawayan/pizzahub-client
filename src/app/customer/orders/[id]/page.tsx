import type { Metadata } from "next";
import CustomerOrderDetails from "@/src/components/customer/customer-order-details";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View your PizzaHub order information.",
};

interface CustomerOrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerOrderDetailsPage({
  params,
}: CustomerOrderDetailsPageProps) {
  const { id } = await params;

  return <CustomerOrderDetails orderId={id} />;
}