import Link from "next/link";
import { ArrowRight, Pizza, UtensilsCrossed } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-extrabold text-primary"
          >
            <Pizza className="h-7 w-7" />
            PizzaHub
          </Link>

          <nav className="flex items-center gap-5">
            <Link
              href="/menu"
              className="text-sm font-medium hover:text-primary"
            >
              Browse Menu
            </Link>

            <Link
              href="/sign-in"
              className="text-sm font-medium hover:text-primary"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center bg-background px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
            <UtensilsCrossed className="h-4 w-4" />
            Welcome to PizzaHub
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Fresh & Hot Pizza,
            <span className="mt-2 block text-primary">
              Delivered to Your Door.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            Discover amazing local pizza restaurants, explore delicious
            menus, and enjoy your favorite pizza with PizzaHub.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Explore Menu
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/sign-up"
              className="rounded-lg border border-border bg-card px-7 py-3.5 font-semibold transition hover:bg-secondary"
            >
              Join PizzaHub
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card px-6 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} PizzaHub. All rights reserved.
      </footer>
    </main>
  );
}
