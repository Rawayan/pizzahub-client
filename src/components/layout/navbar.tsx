
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Pizza,
  UserRound,
  X,
} from "lucide-react";

import { useSession, authClient } from "@/src/lib/auth-client";
import ThemeToggle from "@/src/components/layout/theme-toggle";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isAuthenticated = Boolean(session?.user);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        console.error("Logout failed:", error);
        return;
      }

      closeMobileMenu();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const isLinkActive = (href: string) =>
    pathname === href ||
    (href !== "/" && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-card/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex shrink-0 items-center gap-2"
          aria-label="PizzaHub home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:rotate-[-8deg]">
            <Pizza className="size-6" />
          </span>

          <span className="text-2xl font-extrabold tracking-tight text-foreground">
            Pizza<span className="text-primary">Hub</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors ${
                isLinkActive(link.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {isPending ? (
            <div
              className="h-9 w-28 animate-pulse rounded-lg bg-muted"
              aria-label="Loading account"
            />
          ) : isAuthenticated ? (
            <>
              <span className="max-w-40 truncate text-sm font-medium text-muted-foreground">
                {session?.user.name || session?.user.email}
              </span>

              <Link
                href="/profile"
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  isLinkActive("/profile")
                    ? "border-primary text-primary"
                    : "border-border text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                <UserRound className="size-4" />
                Profile Settings
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? "Signing out..." : "Sign out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition hover:text-primary"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:shadow-md"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((previous) => !previous)
            }
            className="flex size-10 items-center justify-center rounded-lg border border-border text-foreground transition hover:bg-muted"
            aria-label={
              mobileMenuOpen ? "Close menu" : "Open menu"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-border bg-card px-4 py-4 shadow-lg md:hidden"
        >
          <nav
            className="flex flex-col gap-1"
            aria-label="Mobile navigation"
          >
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isLinkActive(link.href)
                    ? "bg-secondary text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 border-t border-border" />

            {isPending ? (
              <div className="h-10 animate-pulse rounded-lg bg-muted" />
            ) : isAuthenticated ? (
              <>
                <p className="truncate px-4 py-2 text-sm text-muted-foreground">
                  {session?.user.name || session?.user.email}
                </p>

                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isLinkActive("/profile")
                      ? "bg-secondary text-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <UserRound className="size-4" />
                  Profile Settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full rounded-lg border border-border px-4 py-3 text-left text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary disabled:opacity-60"
                >
                  {loggingOut ? "Signing out..." : "Sign out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
