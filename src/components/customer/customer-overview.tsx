"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Pizza,
  ShoppingBag,
  XCircle,
} from "lucide-react";

import { apiFetch } from "@/src/lib/api-client";

interface CustomerStatistics {
  totalOrders: number;
  pendingOrders: number;
  acceptedOrders: number;
  rejectedOrders: number;
  cancelledOrders: number;
}

const initialStatistics: CustomerStatistics = {
  totalOrders: 0,
  pendingOrders: 0,
  acceptedOrders: 0,
  rejectedOrders: 0,
  cancelledOrders: 0,
};

const statisticCards = [
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: ShoppingBag,
    description: "All your orders",
    iconClass: "bg-primary/10 text-primary",
  },
  {
    key: "pendingOrders",
    label: "Pending",
    icon: Clock3,
    description: "Waiting for vendor",
    iconClass: "bg-amber-100 text-amber-700",
  },
  {
    key: "acceptedOrders",
    label: "Accepted",
    icon: CheckCircle2,
    description: "Confirmed orders",
    iconClass: "bg-green-100 text-green-700",
  },
  {
    key: "rejectedOrders",
    label: "Rejected",
    icon: XCircle,
    description: "Not accepted",
    iconClass: "bg-red-100 text-red-700",
  },
] as const;

export default function CustomerOverview() {
  const [statistics, setStatistics] =
    useState<CustomerStatistics>(initialStatistics);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch("/api/customer/dashboard", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load your dashboard."
          );
        }

        if (active) {
          setStatistics(result.data.statistics);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Something went wrong."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 via-primary to-orange-500 px-6 py-8 text-white shadow-lg sm:px-9 sm:py-10">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/80">
            Your PizzaHub account
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your orders, all in one place.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
            Check your order history, see what is happening with your
            pizza, and keep track of every delivery.
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-red-700 shadow-sm transition hover:bg-orange-50"
          >
            Explore Pizza Menu
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <Pizza className="absolute -bottom-10 -right-6 size-48 rotate-12 text-white/10 sm:size-64" />
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-primary">
              Dashboard overview
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
              Order Statistics
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A quick summary of your PizzaHub orders.
            </p>
          </div>

          <Link
            href="/customer/orders"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            View all orders
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="ml-2 font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statisticCards.map((card) => {
            const Icon = card.icon;
            const value = statistics[card.key];

            return (
              <div
                key={card.key}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      {card.label}
                    </p>

                    <p className="mt-3 text-3xl font-extrabold tracking-tight">
                      {loading ? (
                        <span className="inline-block h-9 w-12 animate-pulse rounded bg-muted" />
                      ) : (
                        value
                      )}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </div>

                  <div
                    className={`flex size-11 items-center justify-center rounded-xl ${card.iconClass}`}
                  >
                    <Icon className="size-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ClipboardList className="size-5" />
            </div>

            <div>
              <h3 className="font-extrabold">Order activity</h3>
              <p className="text-sm text-muted-foreground">
                Your order status breakdown
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {[
              {
                label: "Pending",
                value: statistics.pendingOrders,
                color: "bg-amber-500",
              },
              {
                label: "Accepted",
                value: statistics.acceptedOrders,
                color: "bg-green-500",
              },
              {
                label: "Rejected",
                value: statistics.rejectedOrders,
                color: "bg-red-500",
              },
              {
                label: "Cancelled",
                value: statistics.cancelledOrders,
                color: "bg-gray-400",
              },
            ].map((item) => {
              const percentage =
                statistics.totalOrders > 0
                  ? (item.value / statistics.totalOrders) * 100
                  : 0;

              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold">{item.label}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {loading ? "—" : item.value}
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{
                        width: loading ? "0%" : `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
              <Pizza className="size-5" />
            </div>

            <h3 className="mt-5 text-xl font-extrabold">
              Craving something delicious?
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Discover approved pizzas from restaurants, choose your
              favorite, and place your next delivery request.
            </p>
          </div>

          <Link
            href="/menu"
            className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            Browse Menu
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}