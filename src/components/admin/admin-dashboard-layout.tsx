
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Pizza,
  ReceiptText,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

import type { ReactNode } from "react";

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
    <div className="min-h-[calc(100vh-5rem)] bg-[#fffaf5]">
      <div className="mx-auto flex max-w-[1600px] flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-orange-100 bg-white p-4 lg:min-h-[calc(100vh-5rem)] lg:w-72 lg:border-r lg:border-b-0 lg:p-6">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
              <ShieldCheck className="size-6" />
            </div>

            <div>
              <h2 className="font-extrabold text-gray-900">
                PizzaHub Admin
              </h2>
              <p className="text-xs text-gray-500">
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
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-red-50 text-red-700"
                      : "text-gray-600 hover:bg-orange-50 hover:text-red-700"
                  }`}
                >
                  <Icon className="size-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-7 border-t border-orange-100 pt-5">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 transition hover:bg-orange-50 hover:text-red-700"
            >
              <ArrowLeft className="size-5" />
              Back to website
            </Link>
          </div>

          <div className="mt-8 hidden rounded-2xl bg-orange-50 p-4 lg:block">
            <p className="text-sm font-bold text-gray-900">
              Administrator access
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-600">
              Manage platform users, review menu submissions, and monitor
              subscription payments.
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
