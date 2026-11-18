
import Link from "next/link";
import { ArrowUpRight, Pizza } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
  { label: "Sign In", href: "/login" },
  { label: "Create Account", href: "/register" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand information */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2"
              aria-label="PizzaHub home"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Pizza className="size-6" />
              </span>

              <span className="text-2xl font-extrabold tracking-tight text-foreground">
                Pizza<span className="text-primary">Hub</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
              Discover delicious pizzas, explore local restaurants, and enjoy
              fresh pizza delivered straight to your door.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Quick Links
            </h2>

            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform information */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Made for Pizza Lovers
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              PizzaHub brings customers and pizza restaurants together through
              a convenient online ordering experience.
            </p>

            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground">
              <Pizza className="size-3.5" />
              Freshness in every bite
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">

          <p className="text-sm text-muted-foreground">
            © 2026 PizzaHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
