
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Pizza,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  UserRound,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { authClient } from "@/src/lib/auth-client";

interface CustomerDashboardLayoutProps {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}

const navigation = [
  {
    label: "Overview",
    href: "/customer/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Orders",
    href: "/customer/orders",
    icon: ClipboardList,
  },
  {
    label: "Profile Settings",
    href: "/profile",
    icon: Settings,
  },
];

export default function CustomerDashboardLayout({
  children,
  userName,
  userEmail,
}: CustomerDashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message || "Unable to sign out.");
      }

      setMobileOpen(false);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Customer logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const SidebarContent = () => (
    <>
      {/* Brand */}

      <div className="border-b border-border px-6 py-6">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Pizza className="size-6" />
          </span>

          <span className="text-xl font-extrabold tracking-tight">
            Pizza<span className="text-primary">Hub</span>
          </span>
        </Link>

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Customer workspace
        </p>
      </div>

      {/* Customer Information */}

      <div className="border-b border-border px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">
              {userName}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}

      <nav
        className="flex-1 space-y-1 px-3 py-5"
        aria-label="Customer dashboard navigation"
      >
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Dashboard
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== "/customer/dashboard" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                active
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

      {/* Sidebar Footer */}

      <div className="space-y-2 border-t border-border p-4">
        <Link
          href="/menu"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />

          Browse Pizza Menu
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-muted-foreground transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="size-5" />

          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-muted/30">
      <div className="mx-auto flex max-w-[1600px]">
        {/* Desktop Sidebar */}

        <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-72 shrink-0 flex-col border-r border-border bg-card md:flex">
          <SidebarContent />
        </aside>

        {/* Main Content */}

        <div className="min-w-0 flex-1">
          {/* Mobile Header */}

          <div className="sticky top-16 z-30 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur md:hidden">
            <div>
              <p className="text-sm font-bold">
                Customer Dashboard
              </p>

              <p className="text-xs text-muted-foreground">
                Welcome, {userName}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="flex size-10 items-center justify-center rounded-lg border border-border"
              aria-label="Toggle customer navigation"
              aria-expanded={mobileOpen}
              aria-controls="customer-mobile-navigation"
            >
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>

          {/* Mobile Sidebar */}

          {mobileOpen && (
            <div
              id="customer-mobile-navigation"
              className="fixed inset-0 top-16 z-40 bg-black/30 md:hidden"
            >
              <aside className="relative flex h-full w-[min(19rem,85vw)] flex-col border-r border-border bg-card shadow-xl">
                <SidebarContent />
              </aside>

              <button
                type="button"
                className="absolute inset-0 -z-10"
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
              />
            </div>
          )}

          {/* Page Content */}

          <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
