
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChefHat,
  Clock3,
  Flame,
  Leaf,
  MapPin,
  Pizza,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Truck,
  Utensils,
  Users,
} from "lucide-react";

interface MenuItem {
  id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  createdAt: string;
}

interface MenuApiResponse {
  success: boolean;
  message?: string;
  data?: {
    items: MenuItem[];
    categories: string[];
    total: number;
  };
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const categories = [
  {
    name: "Classic",
    description: "Timeless pizza favorites",
    icon: Pizza,
    emoji: "🍕",
  },
  {
    name: "Vegetarian",
    description: "Fresh and flavorful",
    icon: Leaf,
    emoji: "🥬",
  },
  {
    name: "Chicken",
    description: "Delicious chicken toppings",
    icon: ChefHat,
    emoji: "🍗",
  },
  {
    name: "Beef",
    description: "Rich and savory flavors",
    icon: Flame,
    emoji: "🥩",
  },
  {
    name: "Seafood",
    description: "A taste of the ocean",
    icon: Utensils,
    emoji: "🍤",
  },
  {
    name: "Specialty",
    description: "Unique pizza creations",
    icon: Star,
    emoji: "⭐",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Trusted Restaurants",
    description:
      "Discover menu items reviewed and approved before appearing on the platform.",
  },
  {
    icon: Clock3,
    title: "Convenient Ordering",
    description:
      "Explore available options and place your orders through one convenient platform.",
  },
  {
    icon: MapPin,
    title: "Local Food Discovery",
    description:
      "Discover restaurants and menu items available in different locations.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Experience",
    description:
      "Enjoy a platform designed to make discovering and ordering pizza easier.",
  },
];

const steps = [
  {
    number: "01",
    icon: Store,
    title: "Explore Restaurants",
    description:
      "Browse available menu items and discover restaurants on PizzaHub.",
  },
  {
    number: "02",
    icon: ShoppingBag,
    title: "Choose Your Pizza",
    description:
      "Find a pizza you love and submit your order with delivery details.",
  },
  {
    number: "03",
    icon: Truck,
    title: "Receive Your Order",
    description:
      "Follow your order status and get ready to enjoy your pizza.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const image = item.images?.[0];

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl"
    >
      <div
        className="relative flex h-52 items-center justify-center overflow-hidden bg-secondary bg-cover bg-center"
        style={
          image
            ? {
                backgroundImage: `url("${image}")`,
              }
            : undefined
        }
      >
        {!image && (
          <div className="flex flex-col items-center gap-2 text-primary">
            <Pizza className="size-16" />
            <span className="text-sm font-semibold">PizzaHub</span>
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-card/95 px-3 py-1.5 text-xs font-bold text-primary shadow-sm">
          {item.category}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-foreground">
            {item.itemName}
          </h3>

          <span className="shrink-0 rounded-lg bg-secondary px-3 py-1.5 text-sm font-extrabold text-primary">
            {formatPrice(item.price)}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
          {item.description || "Discover this delicious menu item."}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-primary" />
            <span className="truncate">
              {item.location || "Location available from restaurant"}
            </span>
          </div>

          <Link
            href={`/menu/${item.id}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            Product Details
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function MenuItemSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="h-52 animate-pulse bg-muted" />
      <div className="space-y-4 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMenuItems = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/menu-items?limit=6`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
          signal,
        }
      );

      const result =
        (await response.json()) as MenuApiResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load menu items."
        );
      }

      setMenuItems(result.data?.items ?? []);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      console.error("Homepage menu loading failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading menu items."
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    queueMicrotask(() => void fetchMenuItems(controller.signal));

    return () => {
      controller.abort();
    };
  }, [fetchMenuItems]);

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {/* ----------------------------------
          HERO SECTION
      ---------------------------------- */}
      <section className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-28 size-96 rounded-full bg-accent/25 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-28 size-96 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center lg:text-left"
          >
            <motion.div
              variants={itemVariants}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-sm"
            >
              <Flame className="size-4 text-primary" />
              Your pizza journey starts here
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Good Times.
              <span className="mt-2 block text-primary">
                Great Pizza.
              </span>
              <span className="mt-2 block">
                Delivered Fresh.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg lg:mx-0"
            >
              Discover delicious pizzas from local restaurants, explore
              exciting menu choices, and enjoy a convenient ordering
              experience with PizzaHub.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-9 flex flex-wrap justify-center gap-4 lg:justify-start"
            >
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-bold text-primary-foreground shadow-md transition hover:-translate-y-1 hover:bg-primary/90 hover:shadow-lg"
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
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-sm text-muted-foreground"
            >
              Already have an account?{" "}
              <Link
                href="/login?callbackURL=/dashboard"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground lg:justify-start"
            >
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="size-4 text-primary" />
                Approved menu items
              </span>

              <span className="inline-flex items-center gap-2">
                <Users className="size-4 text-primary" />
                Customer focused
              </span>
            </motion.div>
          </motion.div>

          {/* Hero illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto flex aspect-square w-full max-w-lg items-center justify-center"
          >
            <div className="absolute inset-4 rounded-full border border-dashed border-primary/30" />

            <div className="absolute inset-12 rounded-full bg-secondary/80" />

            <div className="relative flex size-60 items-center justify-center rounded-full border-[14px] border-amber-800/80 bg-amber-400 shadow-2xl sm:size-80">
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

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute right-0 top-10 rounded-2xl border border-border bg-card px-4 py-3 shadow-xl sm:right-2"
            >
              <p className="text-xs font-medium text-muted-foreground">
                Made for
              </p>
              <p className="font-bold text-foreground">
                Pizza Lovers ❤️
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-8 left-0 rounded-2xl border border-border bg-card px-4 py-3 shadow-xl sm:left-2"
            >
              <p className="text-xs font-medium text-muted-foreground">
                Your next favorite
              </p>
              <p className="font-bold text-primary">
                Pizza is waiting!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ----------------------------------
          CATEGORY SECTION
      ---------------------------------- */}
      <section className="border-y border-border bg-card px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              Find Your Favorite
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
              Explore Pizza Categories
            </h2>

            <p className="mt-4 text-muted-foreground">
              There is always something delicious to discover.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <motion.div
                  key={category.name}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <Link
                    href="/menu"
                    className="flex h-full flex-col items-center rounded-2xl border border-border bg-background p-5 text-center transition hover:border-primary/50 hover:shadow-lg"
                  >
                    <span className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-3xl">
                      {category.emoji}
                    </span>

                    <Icon className="mt-4 size-4 text-primary" />

                    <h3 className="mt-2 font-bold text-foreground">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {category.description}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ----------------------------------
          FEATURED MENU ITEMS
      ---------------------------------- */}
      <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                Fresh From Our Restaurants
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
                Featured Menu Picks
              </h2>

              <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
                Discover recently approved menu items available from
                restaurants on PizzaHub.
              </p>
            </div>

            <Link
              href="/menu"
              className="inline-flex items-center gap-2 font-bold text-primary transition hover:gap-3"
            >
              Browse all menu items
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <MenuItemSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-destructive/30 bg-card px-6 py-12 text-center">
              <p className="font-semibold text-foreground">
                We could not load the menu right now.
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void fetchMenuItems()}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                <RefreshCw className="size-4" />
                Try again
              </button>
            </div>
          ) : menuItems.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={containerVariants}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {menuItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
              <Pizza className="mx-auto size-12 text-primary" />

              <h3 className="mt-4 text-xl font-bold text-foreground">
                Fresh menu items are coming soon!
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                There are no approved menu items to display yet. Please
                check back after restaurants publish their menus.
              </p>

              <Link
                href="/register"
                className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                Join PizzaHub
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ----------------------------------
          WHY CHOOSE PIZZAHUB
      ---------------------------------- */}
      <section className="border-y border-border bg-card px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              The PizzaHub Difference
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
              Why Choose PizzaHub?
            </h2>

            <p className="mt-4 leading-7 text-muted-foreground">
              We make discovering restaurants and ordering your
              favorite food a more convenient experience.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <motion.article
                  key={benefit.title}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl border border-border bg-background p-7 transition hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="flex size-13 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-foreground">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {benefit.description}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ----------------------------------
          HOW IT WORKS
      ---------------------------------- */}
      <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              Simple and Convenient
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
              How PizzaHub Works
            </h2>

            <p className="mt-4 leading-7 text-muted-foreground">
              Enjoy a straightforward journey from discovering a pizza
              to placing your order.
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
                >
                  <span className="absolute right-6 top-5 text-4xl font-black text-primary/10">
                    {step.number}
                  </span>

                  <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Icon className="size-7" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-foreground">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------------------------
          VENDOR PREMIUM PROMOTION
      ---------------------------------- */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary px-6 py-14 text-primary-foreground sm:px-12 lg:px-16 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full border-[45px] border-white/10"
          />

          <div className="relative flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider">
                <Star className="size-4" />
                For Restaurant Owners
              </span>

              <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
                Grow Your Restaurant with PizzaHub
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-white/85">
                Bring your menu online, manage incoming orders, and
                explore Premium subscription benefits for your
                restaurant.
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-primary shadow-lg transition hover:-translate-y-1 hover:bg-white/90"
            >
              Become a Vendor
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------------------------
          FINAL CALL TO ACTION
      ---------------------------------- */}
      <section className="border-t border-border bg-card px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Pizza className="mx-auto size-12 text-primary" />

          <h2 className="mt-5 text-3xl font-extrabold text-foreground sm:text-4xl">
            Ready for Something Delicious?
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Explore PizzaHub and discover your next favorite pizza.
          </p>

          <Link
            href="/menu"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-bold text-primary-foreground shadow-md transition hover:-translate-y-1 hover:bg-primary/90"
          >
            Start Exploring
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
