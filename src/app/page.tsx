
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  MapPin,
  Pizza,
  UtensilsCrossed,
} from "lucide-react";

const highlights = [
  {
    icon: Pizza,
    title: "Delicious Choices",
    description:
      "Explore a variety of pizzas and discover your next favorite meal.",
  },
  {
    icon: Clock3,
    title: "Convenient Ordering",
    description:
      "Enjoy a straightforward ordering experience whenever hunger strikes.",
  },
  {
    icon: MapPin,
    title: "Local Restaurants",
    description:
      "Discover pizza restaurants and the food they have to offer.",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero section */}
      <section className="relative flex flex-1 items-center overflow-hidden bg-background px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-accent/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
          {/* Hero content */}
          <div className="text-center lg:text-left">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-sm">
              <UtensilsCrossed className="size-4 text-primary" />
              Welcome to PizzaHub
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Fresh & Hot Pizza,
              <span className="mt-2 block text-primary">
                Delivered to Your Door.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg lg:mx-0">
              Discover amazing local pizza restaurants, explore delicious
              menus, and enjoy your favorite pizza with PizzaHub.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-bold text-primary-foreground shadow-md transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
              >
                Explore Menu
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-7 py-3.5 font-bold text-foreground transition hover:border-primary hover:bg-secondary"
              >
                Join PizzaHub
              </Link>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Decorative pizza visual */}
          <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
            <div className="absolute inset-5 rounded-full border border-dashed border-primary/25" />

            <div className="absolute inset-12 rounded-full bg-secondary/80" />

            <div className="relative flex size-56 items-center justify-center rounded-full border-[12px] border-amber-700/80 bg-amber-400 shadow-2xl sm:size-72">
              <div className="absolute inset-3 rounded-full border-4 border-amber-200/80" />

              <div className="grid grid-cols-3 gap-4 text-4xl sm:text-5xl">
                <span>🍅</span>
                <span>🧀</span>
                <span>🍄</span>
                <span>🫑</span>
                <span>🍕</span>
                <span>🫒</span>
                <span>🧀</span>
                <span>🍅</span>
                <span>🫑</span>
              </div>
            </div>

            <div className="absolute right-0 top-10 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg sm:right-2">
              <p className="text-xs font-medium text-muted-foreground">
                Made for
              </p>
              <p className="font-bold text-foreground">Pizza Lovers ❤️</p>
            </div>

            <div className="absolute bottom-8 left-0 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg sm:left-2">
              <p className="text-xs font-medium text-muted-foreground">
                Your next favorite
              </p>
              <p className="font-bold text-primary">Pizza is waiting!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform highlights */}
      <section className="border-t border-border bg-card px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              Why PizzaHub?
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              A better way to enjoy pizza
            </h2>

            <p className="mt-4 leading-7 text-muted-foreground">
              Everything you need to discover pizza restaurants and enjoy
              delicious food in one place.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-border bg-background p-7 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
