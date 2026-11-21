
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  Clock,
  Crown,
  Loader2,
  Pizza,
  ShoppingBag,
} from "lucide-react";

import { apiFetch } from "@/src/lib/api-client";

interface DashboardData {
  vendor: {
    name: string;
    businessName: string;
  };
  statistics: {
    totalMenuItems: number;
    activeMenuItems: number;
    pendingMenuItems: number;
    pendingOrders: number;
    acceptedOrders: number;
  };
  subscription: {
    plan: "free" | "premium";
    activeItemLimit: number | null;
    remainingActiveSlots: number | null;
    expiresAt: string | null;
  };
}

const statisticCards = [
  {
    key: "totalMenuItems",
    label: "Total Menu Items",
    icon: Pizza,
    color: "bg-orange-100 text-orange-700",
  },
  {
    key: "activeMenuItems",
    label: "Active Items",
    icon: Activity,
    color: "bg-green-100 text-green-700",
  },
  {
    key: "pendingOrders",
    label: "Pending Orders",
    icon: Clock,
    color: "bg-amber-100 text-amber-700",
  },
  {
    key: "acceptedOrders",
    label: "Accepted Orders",
    icon: CheckCircle2,
    color: "bg-blue-100 text-blue-700",
  },
] as const;

export default function VendorOverview() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch("/api/vendor/dashboard");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load dashboard.");
      }

      setDashboard(result.data as DashboardData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => void loadDashboard());
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-card p-8 text-center">
        <p className="font-semibold text-destructive">{error}</p>
        <button
          onClick={() => void loadDashboard()}
          className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboard) return null;

  const { statistics, subscription, vendor } = dashboard;

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">
            Vendor Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-foreground">
            Welcome, {vendor.name}!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage {vendor.businessName} and keep your menu up to date.
          </p>
        </div>

        <Link
          href="/vendor/menu/new"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          + Add Menu Item
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statisticCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className={`rounded-xl p-3 ${card.color}`}>
                  <Icon className="size-5" />
                </span>
              </div>

              <p className="mt-5 text-3xl font-extrabold text-foreground">
                {statistics[card.key]}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {card.label}
              </p>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
              <Crown className="size-6" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Current Subscription
              </p>

              <h2 className="text-xl font-extrabold capitalize text-foreground">
                {subscription.plan} Plan
              </h2>
            </div>
          </div>

          {subscription.plan === "free" ? (
            <Link
              href="/vendor/dashboard#subscription"
              className="rounded-xl border border-primary px-5 py-3 text-center text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              Upgrade to Premium
            </Link>
          ) : (
            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
              Premium Vendor
            </span>
          )}
        </div>

        <div className="mt-5 border-t border-border pt-5">
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            <span className="text-muted-foreground">
              Active menu item allowance
            </span>

            <span className="font-bold text-foreground">
              {subscription.activeItemLimit === null
                ? "Unlimited"
                : `${statistics.activeMenuItems} / ${subscription.activeItemLimit}`}
            </span>
          </div>

          {subscription.activeItemLimit !== null && (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (statistics.activeMenuItems /
                      subscription.activeItemLimit) *
                      100
                  )}%`,
                }}
              />
            </div>
          )}

          {subscription.plan === "free" &&
            subscription.remainingActiveSlots === 0 && (
              <p className="mt-3 text-sm font-medium text-amber-700">
                You have reached your Free plan active item limit.
              </p>
            )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <Clock className="size-5 text-amber-600" />
            <h3 className="font-bold text-foreground">
              Items Awaiting Approval
            </h3>
          </div>

          <p className="mt-4 text-3xl font-extrabold text-foreground">
            {statistics.pendingMenuItems}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Submitted items waiting for admin review.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="size-5 text-primary" />
            <h3 className="font-bold text-foreground">
              Order Management
            </h3>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Your pending and accepted order counts are shown above.
            Full order actions are implemented in STEP 13.
          </p>
        </div>
      </section>
    </div>
  );
}
