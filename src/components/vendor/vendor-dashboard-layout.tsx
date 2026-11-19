
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Pizza,
  PlusCircle,
  Store,
} from "lucide-react";

interface VendorDashboardLayoutProps {
  children: React.ReactNode;
  vendorName: string;
}

const navigation = [
  {
    label: "Overview",
    href: "/vendor/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Menu Items",
    href: "/vendor/menu",
    icon: Pizza,
  },
  {
    label: "Add Menu Item",
    href: "/vendor/menu/new",
    icon: PlusCircle,
  },
];

export default function VendorDashboardLayout({
  children,
  vendorName,
}: VendorDashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[250px_1fr] lg:px-8">
        <aside className="h-fit rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-5 flex items-center gap-3 px-2 py-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Store className="size-6" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Vendor Panel
              </p>
              <p className="truncate font-bold text-foreground">
                {vendorName}
              </p>
            </div>
          </div>

          <nav className="space-y-2" aria-label="Vendor navigation">
            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                (item.href !== "/vendor/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-border pt-4">
            <Link
              href="/"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              ← Back to website
            </Link>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
