
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  ReceiptText,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

import { apiFetch } from "@/src/lib/api-client";
import { toast } from "sonner";

type TransactionStatus =
  | "pending"
  | "completed"
  | "failed"
  | "cancelled";

interface AdminTransaction {
  id: string;
  vendor: {
    name: string;
    email: string;
    businessName?: string;
  } | null;
  plan: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  createdAt: string;
}

interface TransactionsResponse {
  success: boolean;
  message?: string;
  data: {
    transactions: AdminTransaction[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export default function AdminTransactions() {
  const [transactions, setTransactions] =
    useState<AdminTransaction[]>([]);

  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        status,
        page: String(page),
        limit: "10",
      });

      const response = await apiFetch(
        `/api/admin/transactions?${params.toString()}`,
        { cache: "no-store" }
      );

      const result =
        (await response.json()) as TransactionsResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load transactions."
        );
      }

      setTransactions(result.data.transactions);
      setTotal(result.data.pagination.total);
      setTotalPages(
        Math.max(1, result.data.pagination.totalPages)
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load transactions.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  const formatAmount = (amount: number, currency: string) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);

  const statusStyle: Record<TransactionStatus, string> = {
    completed: "bg-green-50 text-green-700",
    pending: "bg-yellow-50 text-yellow-800",
    failed: "bg-red-50 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
  };

  const StatusIcon = ({
    value,
  }: {
    value: TransactionStatus;
  }) => {
    if (value === "completed") {
      return <CheckCircle2 className="size-4" />;
    }

    if (value === "pending") {
      return <Clock className="size-4" />;
    }

    return <XCircle className="size-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-red-600">
            Administration
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
            Transactions
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Monitor vendor Premium subscription payments.
          </p>
        </div>

        <div className="rounded-xl border border-orange-100 bg-white px-4 py-3">
          <p className="text-xs text-gray-500">Total transactions</p>
          <p className="text-2xl font-extrabold text-gray-900">
            {total.toLocaleString()}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
              <ReceiptText className="size-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">
                Payment Records
              </h2>
              <p className="text-xs text-gray-500">
                View-only transaction history
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-400"
            >
              <option value="all">All statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={() => void loadTransactions()}
              className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-red-300 hover:text-red-700"
            >
              <RefreshCw className="size-4" />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-xl bg-orange-50"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="font-semibold text-red-700">{error}</p>
            <button
              onClick={() => void loadTransactions()}
              className="mt-3 rounded-xl bg-red-600 px-5 py-2 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <Search className="mx-auto size-10 text-orange-300" />
            <h3 className="mt-3 font-bold text-gray-900">
              No transactions found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no records matching this status.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-orange-50/70 text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Vendor
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Subscription
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Amount
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Transaction Date
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Payment Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t border-orange-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">
                        {transaction.vendor?.businessName ||
                          transaction.vendor?.name ||
                          "Unknown vendor"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {transaction.vendor?.email || "Vendor unavailable"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold capitalize text-orange-800">
                        {transaction.plan}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-extrabold text-gray-900">
                      {formatAmount(
                        transaction.amount,
                        transaction.currency
                      )}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {new Date(
                        transaction.createdAt
                      ).toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyle[transaction.status]}`}
                      >
                        <StatusIcon value={transaction.status} />
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

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
          >
            Previous
          </button>

          <button
            disabled={page >= totalPages || loading}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <p className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
        Payment records are read-only. Administrators can monitor
        transaction details, but cannot edit payment amounts, change
        payment statuses, or delete transaction records.
      </p>
    </div>
  );
}
