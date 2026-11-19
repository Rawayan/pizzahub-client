import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { getServerSession } from "@/src/lib/get-server-session";
import MenuItemDetails from "@/src/components/menu/menu-item-details";

interface MenuItemPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Menu Item Details",
  description:
    "View pizza details, images, price, restaurant location, and vendor information on PizzaHub.",
};

export default async function MenuItemPage({
  params,
}: MenuItemPageProps) {
  const { id } = await params;

  const session = await getServerSession();

  if (!session?.user) {
    const callbackURL = `/menu/${id}`;

    redirect(
      `/login?callbackURL=${encodeURIComponent(callbackURL)}`
    );
  }

  const user = session.user as typeof session.user & {
    role?: string;
    isBlocked?: boolean;
  };

  if (user.isBlocked === true) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16">
        <div className="max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-extrabold text-foreground">
            Account access restricted
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            This account is currently blocked and cannot access
            protected PizzaHub features.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <MenuItemDetails
      itemId={id}
      viewerId={session.user.id}
      viewerRole={user.role || "customer"}
    />
  );
}
