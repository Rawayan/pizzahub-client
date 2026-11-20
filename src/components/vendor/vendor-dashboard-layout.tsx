
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ArrowLeft,
  ClipboardList,
  Crown,
  LayoutDashboard,
  PlusCircle,
  Pizza,
  Store,
  UserRound,
} from "lucide-react";

interface VendorDashboardLayoutProps {
  children: React.ReactNode;
  vendorName: string;
}

const navigationItems = [
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
  {
    label: "Customer Orders",
    href: "/vendor/orders",
    icon: ClipboardList,
  },
  {
    label: "Subscription",
    href: "/vendor/subscription",
    icon: Crown,
  },
  {
    label: "Profile Settings",
    href: "/profile",
    icon: UserRound,
  },
];

export default function VendorDashboardLayout({
  children,
  vendorName,
}: VendorDashboardLayoutProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/vendor/dashboard") {
      return pathname === href;
    }

    if (href === "/vendor/menu") {
      return (
        pathname === href ||
        (pathname.startsWith("/vendor/menu/") &&
          !pathname.startsWith("/vendor/menu/new"))
      );
    }

    if (href === "/vendor/menu/new") {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {/* Sidebar */}

      <aside className="z-20 flex w-full shrink-0 flex-col border-b border-border bg-card md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        {/* Brand */}

        <div className="border-b border-border p-5">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Pizza className="size-6" />
            </div>

            <div>
              <p className="text-xl font-black tracking-tight text-card-foreground">
                PizzaHub
              </p>

              <p className="text-xs font-semibold text-muted-foreground">
                Vendor Dashboard
              </p>
            </div>
          </Link>
        </div>

        {/* Vendor Information */}

        <div className="hidden p-5 md:block">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Signed in as
          </p>

          <p className="mt-2 truncate text-sm font-bold text-card-foreground">
            {vendorName}
          </p>

          <span className="mt-2 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
            Vendor Account
          </span>
        </div>

        {/* Navigation */}

        <nav
          className="flex flex-row gap-2 overflow-x-auto p-3 md:flex-1 md:flex-col md:overflow-visible md:p-4"
          aria-label="Vendor dashboard navigation"
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-card-foreground"
                }`}
              >
                <Icon className="size-5 shrink-0" />

                <span className="whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}

        <div className="hidden border-t border-border p-4 md:block">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-card-foreground"
          >
            <ArrowLeft className="size-4" />

            Back to website
          </Link>

          <div className="mt-3 rounded-xl bg-secondary/70 p-4">
            <div className="flex items-center gap-2">
              <Store className="size-4 text-primary" />

              <p className="text-xs font-bold text-card-foreground">
                Grow your restaurant
              </p>
            </div>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Manage your menu, monitor customer orders,
              and grow your restaurant with PizzaHub.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}

      <div className="min-w-0 flex-1">
        {/* Header */}

        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 px-5 py-3 backdrop-blur sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Restaurant workspace
            </p>

            <p className="mt-1 text-sm font-bold text-card-foreground">
              Welcome, {vendorName}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-card-foreground transition hover:bg-secondary md:hidden"
          >
            <ArrowLeft className="size-4" />

            Website
          </Link>
        </header>

        {/* Page Content */}

        <main className="min-h-[calc(100vh-65px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
