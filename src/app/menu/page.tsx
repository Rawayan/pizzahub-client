
import type { Metadata } from "next";
import MenuBrowser from "@/src/components/menu/menu-browser";

export const metadata: Metadata = {
  title: "Browse Menu",
  description:
    "Explore PizzaHub's approved pizza menu. Search, filter, and discover your next favorite meal.",
};

export default function MenuPage() {
  return <MenuBrowser />;
}
