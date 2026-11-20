
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  LayoutDashboard,
  Users,
  Pizza,
  ReceiptText,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Manage Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Manage Menu",
    href: "/admin/menu-items",
    icon: Pizza,
  },
  {
    label: "Transactions",
    href: "/admin/transactions",
    icon: ReceiptText,
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100dvh-5rem)] bg-background">
      <div className="mx-auto flex max-w-[1600px] flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-border bg-card p-4 lg:sticky lg:top-20 lg:min-h-[calc(100dvh-5rem)] lg:w-72 lg:self-start lg:border-r lg:border-b-0 lg:p-6">
          <div className="mb-5 flex items-center gap-3 lg:mb-8">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="size-6" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate font-extrabold text-card-foreground">
                PizzaHub Admin
              </h2>

              <p className="text-xs text-muted-foreground">
                Platform management
              </p>
            </div>
          </div>

          <nav
            aria-label="Admin navigation"
            className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1"
          >
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-w-0 items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition sm:gap-3 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-5 shrink-0" />

                  <span className="truncate">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 border-t border-border pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-5 shrink-0" />
              Back to website
            </Link>
          </div>

          <div className="mt-7 hidden rounded-2xl bg-secondary p-4 lg:block">
            <p className="text-sm font-bold text-secondary-foreground">
              Administrator access
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Manage platform users, review menu submissions, and
              monitor subscription payments.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
