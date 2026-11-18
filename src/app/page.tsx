
import type { Metadata } from "next";
import HomePage from "@/src/components/home/home-page";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover delicious pizzas from local restaurants, explore menus, and enjoy a convenient pizza ordering experience with PizzaHub.",
  openGraph: {
    title: "PizzaHub | Good Times. Great Pizza.",
    description:
      "Discover delicious pizzas and local restaurants with PizzaHub.",
    siteName: "PizzaHub",
    type: "website",
  },
};

export default function Page() {
  return <HomePage />;
}
