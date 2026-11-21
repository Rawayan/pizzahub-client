
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  Users,
  Store,
  UserRound,
  Pizza,
  Clock,
  ReceiptText,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { apiFetch } from "@/src/lib/api-client";
import { toast } from "sonner";

interface Statistics {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingMenuItems: number;
  approvedMenuItems: number;
  rejectedMenuItems: number;
  inactiveMenuItems: number;
  totalTransactions: number;
  completedTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
}

interface RecentTransaction {
  id: string;
  vendor: {
    name: string;
    businessName?: string;
  } | null;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface DashboardResponse {
  success: boolean;
  message?: string;
  data: {
    statistics: Statistics;
    recentTransactions: RecentTransaction[];
  };
}

const initialStatistics: Statistics = {
  totalUsers: 0,
  totalVendors: 0,
  totalCustomers: 0,
  totalMenuItems: 0,
  pendingMenuItems: 0,
  approvedMenuItems: 0,
  rejectedMenuItems: 0,
  inactiveMenuItems: 0,
  totalTransactions: 0,
  completedTransactions: 0,
  pendingTransactions: 0,
  failedTransactions: 0,
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);

export default function AdminOverview() {
  const [statistics, setStatistics] =
    useState<Statistics>(initialStatistics);

  const [recentTransactions, setRecentTransactions] =
    useState<RecentTransaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch("/api/admin/dashboard", {
        cache: "no-store",
      });

      const result =
        (await response.json()) as DashboardResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load admin dashboard."
        );
      }

      setStatistics(result.data.statistics);
      setRecentTransactions(result.data.recentTransactions ?? []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void loadDashboard());
  }, [loadDashboard]);

  const cards = [
    {
      label: "Total Users",
      value: statistics.totalUsers,
      icon: Users,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Vendors",
      value: statistics.totalVendors,
      icon: Store,
      color: "bg-orange-50 text-orange-700",
    },
    {
      label: "Customers",
      value: statistics.totalCustomers,
      icon: UserRound,
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Menu Items",
      value: statistics.totalMenuItems,
      icon: Pizza,
      color: "bg-red-50 text-red-700",
    },
    {
      label: "Pending Menu",
      value: statistics.pendingMenuItems,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Transactions",
      value: statistics.totalTransactions,
      icon: ReceiptText,
      color: "bg-green-50 text-green-700",
    },
  ];

  const menuStatuses = [
    {
      label: "Approved",
      value: statistics.approvedMenuItems,
      color: "bg-green-500",
    },
    {
      label: "Pending",
      value: statistics.pendingMenuItems,
      color: "bg-yellow-500",
    },
    {
      label: "Rejected",
      value: statistics.rejectedMenuItems,
      color: "bg-red-500",
    },
    {
      label: "Inactive",
      value: statistics.inactiveMenuItems,
      color: "bg-gray-400",
    },
  ];

  const maxMenuValue = Math.max(
    statistics.totalMenuItems,
    1
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-orange-100" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl bg-white shadow-sm"
            />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
        <p className="font-semibold text-red-700">{error}</p>
        <button
          onClick={() => void loadDashboard()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
        >
          <RefreshCw className="size-4" />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-red-600">
            Administration
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Monitor PizzaHub users, menu submissions, and transactions.
          </p>
        </div>

        <button
          onClick={() => void loadDashboard()}
          className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-red-300 hover:text-red-700"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {card.label}
                </p>
                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${card.color}`}
                >
                  <Icon className="size-5" />
                </div>
              </div>

              <p className="mt-4 text-3xl font-extrabold tabular-nums text-gray-900">
                {card.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Menu Item Status
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Current moderation overview
              </p>
            </div>

            <Pizza className="size-6 text-red-600" />
          </div>

          <div className="mt-7 space-y-5">
            {menuStatuses.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-gray-600">
                    {item.label}
                  </span>
                  <span className="font-bold text-gray-900">
                    {item.value}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-orange-50">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: `${
                        (item.value / maxMenuValue) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/admin/menu-items"
            className="mt-7 inline-flex text-sm font-bold text-red-600 hover:text-red-700"
          >
            Manage menu items →
          </Link>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-extrabold text-gray-900">
            Transaction Summary
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current subscription payment statuses
          </p>

          <div className="mt-7 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-green-50 p-4">
              <CheckCircle2 className="size-6 text-emerald-700" />
              <p className="mt-3 text-2xl font-extrabold text-slate-900">
                {statistics.completedTransactions}
              </p>
              <p className="text-sm text-slate-600">Completed</p>
            </div>

            <div className="rounded-xl bg-yellow-50 p-4">
              <Clock className="size-6 text-amber-700" />
              <p className="mt-3 text-2xl font-extrabold text-slate-900">
                {statistics.pendingTransactions}
              </p>
              <p className="text-sm text-slate-600">Pending</p>
            </div>

            <div className="rounded-xl bg-red-50 p-4">
              <XCircle className="size-6 text-rose-700" />
              <p className="mt-3 text-2xl font-extrabold text-slate-900">
                {statistics.failedTransactions}
              </p>
              <p className="text-sm text-slate-600">Failed</p>
            </div>

            <div className="rounded-xl bg-orange-50 p-4">
              <ReceiptText className="size-6 text-[#c2410c]" />
              <p className="mt-3 text-2xl font-extrabold text-slate-900">
                {statistics.totalTransactions}
              </p>
              <p className="text-sm text-slate-600">All transactions</p>
            </div>
          </div>

          <Link
            href="/admin/transactions"
            className="mt-6 inline-flex text-sm font-bold text-red-600 hover:text-red-700"
          >
            View transactions →
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Recent Transactions
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Latest vendor subscription payments
            </p>
          </div>

          <Link
            href="/admin/transactions"
            className="text-sm font-bold text-red-600 hover:text-red-700"
          >
            View all
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <p className="rounded-xl bg-orange-50 p-6 text-center text-sm text-gray-500">
            No transactions have been recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead>
                <tr className="border-b border-orange-100 text-gray-500">
                  <th className="pb-3 font-semibold">Vendor</th>
                  <th className="pb-3 font-semibold">Plan</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-orange-50 last:border-0"
                  >
                    <td className="py-4 font-semibold text-gray-900">
                      {transaction.vendor?.businessName ||
                        transaction.vendor?.name ||
                        "Unknown vendor"}
                    </td>
                    <td className="py-4 capitalize text-gray-600">
                      {transaction.plan}
                    </td>
                    <td className="py-4 font-semibold text-gray-900">
                      {formatAmount(
                        transaction.amount,
                        transaction.currency
                      )}
                    </td>
                    <td className="py-4 text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold capitalize text-green-700">
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
