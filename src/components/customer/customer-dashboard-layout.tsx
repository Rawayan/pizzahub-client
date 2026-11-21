
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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

interface SidebarContentProps {
  userName: string;
  userEmail: string;
  loggingOut: boolean;
  isActive: (href: string) => boolean;
  onNavigate: () => void;
  onLogout: () => void;
}

function SidebarContent({
  userName,
  userEmail,
  loggingOut,
  isActive,
  onNavigate,
  onLogout,
}: SidebarContentProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-border px-5 py-5">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Pizza className="size-6" />
          </span>

          <span className="text-xl font-extrabold tracking-tight text-foreground">
            Pizza<span className="text-primary">Hub</span>
          </span>
        </Link>

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Customer workspace
        </p>
      </div>

      <div className="border-b border-border px-5 py-5">
        <div className="flex min-w-0 items-center gap-3">
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

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 py-5"
        aria-label="Customer dashboard navigation"
      >
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Dashboard
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="size-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-border p-4">
        <Link
          href="/menu"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5 shrink-0" />
          Browse Pizza Menu
        </Link>

        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-muted-foreground transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-950/40"
        >
          <LogOut className="size-5 shrink-0" />
          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </div>
  );
}

export default function CustomerDashboardLayout({
  children,
  userName,
  userEmail,
}: CustomerDashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message || "Unable to sign out.");
      }

      closeMobile();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Customer logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/customer/dashboard" &&
      pathname.startsWith(`${href}/`));

  return (
    <div className="min-h-[calc(100dvh-5rem)] bg-muted/30">
      <div className="mx-auto flex max-w-[1600px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-20 hidden h-[calc(100dvh-5rem)] w-72 shrink-0 flex-col border-r border-border bg-card md:flex">
          <SidebarContent
            userName={userName}
            userEmail={userEmail}
            loggingOut={loggingOut}
            isActive={isActive}
            onNavigate={closeMobile}
            onLogout={() => void handleLogout()}
          />
        </aside>

        <div className="min-w-0 flex-1">
          {/* Mobile header */}
          <div className="sticky top-16 z-30 flex items-center justify-between gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur md:hidden">
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">
                Customer Dashboard
              </p>

              <p className="truncate text-xs text-muted-foreground">
                Welcome, {userName}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-muted"
              aria-label="Open customer navigation"
              aria-expanded={mobileOpen}
              aria-controls="customer-mobile-navigation"
            >
              <Menu className="size-5" />
            </button>
          </div>

          {/* Mobile drawer */}
          {mobileOpen && (
            <div className="fixed inset-0 top-16 z-[60] md:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/50"
                aria-label="Close customer navigation"
                onClick={closeMobile}
              />

              <aside
                id="customer-mobile-navigation"
                className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col border-r border-border bg-card shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <span className="text-sm font-bold text-foreground">
                    Navigation
                  </span>

                  <button
                    type="button"
                    onClick={closeMobile}
                    className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted"
                    aria-label="Close navigation"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <SidebarContent
                  userName={userName}
                  userEmail={userEmail}
                  loggingOut={loggingOut}
                  isActive={isActive}
                  onNavigate={closeMobile}
                  onLogout={() => void handleLogout()}
                />
              </aside>
            </div>
          )}

          <main className="min-h-[calc(100dvh-5rem)] min-w-0 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
