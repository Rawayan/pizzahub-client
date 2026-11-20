
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Crown,
  ExternalLink,
  Loader2,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/src/lib/api-client";

interface Transaction {
  id: string;
  plan: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  createdAt: string;
}

interface SubscriptionData {
  plan: "free" | "premium";
  expiresAt: string | null;
  stripeCustomerConfigured: boolean;
  transactions: Transaction[];
}

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function VendorSubscriptionPage() {
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch("/api/vendor/subscription");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not load subscription information."
        );
      }

      setData(result.data as SubscriptionData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubscription();
  }, [loadSubscription]);

  const startCheckout = async () => {
    try {
      setCheckoutLoading(true);

      const response = await apiFetch(
        "/api/vendor/subscription/checkout",
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.checkoutUrl) {
        throw new Error(result.message || "Unable to start checkout.");
      }

      window.location.assign(result.data.checkoutUrl);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Checkout could not be started."
      );
      setCheckoutLoading(false);
    }
  };

  const openBillingPortal = async () => {
    try {
      setPortalLoading(true);

      const response = await apiFetch(
        "/api/vendor/subscription/portal",
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.portalUrl) {
        throw new Error(result.message || "Unable to open Billing Portal.");
      }

      window.location.assign(result.data.portalUrl);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Billing Portal is unavailable."
      );
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-2xl border border-destructive/30 bg-card p-8 text-center">
          <XCircle className="mx-auto size-10 text-destructive" />
          <p className="mt-3 font-semibold text-destructive">
            {error || "Subscription information is unavailable."}
          </p>
          <button
            onClick={() => void loadSubscription()}
            className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const premium = data.plan === "premium";

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-5 sm:p-8">
      <div>
        <p className="text-sm font-semibold text-primary">
          Vendor Account
        </p>
        <h1 className="mt-1 text-3xl font-black text-foreground">
          Subscription & Billing
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your restaurant's PizzaHub plan and payment history.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
              <Crown className="size-7" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Your current plan
              </p>
              <h2 className="text-2xl font-black capitalize text-foreground">
                {data.plan} Plan
              </h2>
            </div>
          </div>

          {premium ? (
            <div className="mt-6 rounded-2xl bg-green-50 p-4 text-green-800">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="size-5" />
                Premium is active
              </div>
              <p className="mt-2 text-sm">
                {data.expiresAt
                  ? `Current period ends on ${formatDate(data.expiresAt)}.`
                  : "Your Premium subscription is active."}
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-secondary p-4">
              <p className="font-bold text-foreground">
                You are currently on the Free plan.
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Upgrade to publish unlimited active menu items and receive
                Premium vendor benefits.
              </p>
            </div>
          )}

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-foreground">
              <CheckCircle2 className="size-5 text-green-600" />
              Unlimited active menu items with Premium
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground">
              <CheckCircle2 className="size-5 text-green-600" />
              Premium vendor badge
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground">
              <CheckCircle2 className="size-5 text-green-600" />
              Featured placement benefits
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground">
              <CheckCircle2 className="size-5 text-green-600" />
              All Free plan features
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {!premium ? (
              <button
                onClick={() => void startCheckout()}
                disabled={checkoutLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {checkoutLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Crown className="size-5" />
                )}
                Upgrade to Premium
              </button>
            ) : (
              <button
                onClick={() => void openBillingPortal()}
                disabled={portalLoading || !data.stripeCustomerConfigured}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {portalLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <ExternalLink className="size-5" />
                )}
                Manage Subscription
              </button>
            )}

            <button
              onClick={() => void loadSubscription()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground hover:bg-secondary"
            >
              <RefreshCw className="size-4" />
              Refresh
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <ShieldCheck className="size-9 text-primary" />
          <h3 className="mt-4 text-xl font-black text-foreground">
            Secure payments
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Subscription payments are processed by Stripe. PizzaHub does not
            store your card details.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Your Premium access is activated only after PizzaHub verifies
            Stripe's payment notification.
          </p>
          <Link
            href="/vendor/dashboard"
            className="mt-6 inline-flex text-sm font-bold text-primary hover:underline"
          >
            Back to dashboard
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-foreground">
              Payment History
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your latest subscription transactions.
            </p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">
            {data.transactions.length} records
          </span>
        </div>

        {data.transactions.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-semibold text-foreground">
              No subscription payments yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your payment records will appear here after checkout.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 pr-4 font-semibold">Date</th>
                  <th className="pb-3 pr-4 font-semibold">Plan</th>
                  <th className="pb-3 pr-4 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border last:border-0">
                    <td className="py-4 pr-4 text-foreground">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="py-4 pr-4 capitalize text-foreground">
                      {transaction.plan}
                    </td>
                    <td className="py-4 pr-4 font-bold text-foreground">
                      {formatAmount(transaction.amount, transaction.currency)}
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
