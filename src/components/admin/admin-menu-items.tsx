
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Search,
  RefreshCw,
  Pizza,
  Check,
  X,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

import { apiFetch } from "@/src/lib/api-client";
import { toast } from "sonner";

type MenuStatus = "pending" | "approved" | "rejected" | "inactive";

interface AdminMenuItem {
  id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: MenuStatus;
  createdAt: string;
  vendor: {
    name: string;
    email: string;
    businessName?: string;
  } | null;
}

interface MenuResponse {
  success: boolean;
  message?: string;
  data: {
    items: AdminMenuItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export default function AdminMenuItems() {
  const [items, setItems] = useState<AdminMenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        search,
        status,
        page: String(page),
        limit: "10",
      });

      const response = await apiFetch(
        `/api/admin/menu-items?${params.toString()}`,
        { cache: "no-store" }
      );

      const result = (await response.json()) as MenuResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load menu items."
        );
      }

      setItems(result.data.items);
      setTotalItems(result.data.pagination.total);
      setTotalPages(
        Math.max(1, result.data.pagination.totalPages)
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load menu items.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    queueMicrotask(() => void loadItems());
  }, [loadItems]);

  const performAction = async (
    item: AdminMenuItem,
    action: "approve" | "reject" | "status" | "delete"
  ) => {
    try {
      setActionId(item.id);

      let path = `/api/admin/menu-items/${item.id}`;
      let method = "PATCH";
      let body: string | undefined;

      if (action === "approve") {
        path += "/approve";
      } else if (action === "reject") {
        path += "/reject";
      } else if (action === "status") {
        path += "/status";
        body = JSON.stringify({
          status:
            item.status === "approved" ? "inactive" : "approved",
        });
      } else {
        method = "DELETE";
      }

      const response = await apiFetch(path, {
        method,
        ...(body ? { body } : {}),
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to update menu item."
        );
      }

      toast.success(result.message || "Menu item updated.");
      await loadItems();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to update menu item."
      );
    } finally {
      setActionId("");
    }
  };

  const statusStyle: Record<MenuStatus, string> = {
    pending: "bg-yellow-50 text-yellow-800",
    approved: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
    inactive: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-red-600">
            Administration
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
            Manage Menu Items
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Review submissions and manage published menu visibility.
          </p>
        </div>

        <div className="rounded-xl border border-orange-100 bg-white px-4 py-3">
          <p className="text-xs text-gray-500">Total submissions</p>
          <p className="text-2xl font-extrabold text-gray-900">
            {totalItems.toLocaleString()}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              void loadItems();
            }}
            className="flex gap-2"
          >
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search item, category, or location..."
                className="w-full rounded-xl border border-orange-100 py-3 pl-10 pr-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-700"
            >
              Search
            </button>
          </form>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-orange-100 bg-white px-3 py-3 text-sm outline-none focus:border-red-400"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={() => void loadItems()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:border-red-300 hover:text-red-700"
          >
            <RefreshCw className="size-4" />
            Refresh
          </button>
        </div>
      </section>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-2xl bg-white shadow-sm"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
          <p className="font-semibold text-red-700">{error}</p>
          <button
            onClick={() => void loadItems()}
            className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-orange-100 bg-white p-12 text-center">
          <Pizza className="mx-auto size-10 text-orange-300" />
          <h2 className="mt-3 font-bold text-gray-900">
            No menu items found
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            No items match the selected search and filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm"
            >
              <div className="relative h-48 bg-orange-50">
                {item.images[0] ? (
                  <div
                    className="size-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${item.images[0]}")`,
                    }}
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Pizza className="size-12 text-orange-200" />
                  </div>
                )}

                <span
                  className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyle[item.status]}`}
                >
                  {item.status}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-red-600">
                      {item.category}
                    </p>
                    <h2 className="mt-1 text-lg font-extrabold text-gray-900">
                      {item.itemName}
                    </h2>
                  </div>

                  <p className="shrink-0 font-extrabold text-red-600">
                    ৳{item.price.toLocaleString()}
                  </p>
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                  {item.description}
                </p>

                <div className="mt-4 border-t border-orange-50 pt-4">
                  <p className="text-xs text-gray-500">Vendor</p>
                  <p className="mt-1 text-sm font-bold text-gray-800">
                    {item.vendor?.businessName ||
                      item.vendor?.name ||
                      "Unknown vendor"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.vendor?.email || "Vendor account unavailable"}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    Location: {item.location}
                  </p>
                </div>

                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {item.status === "pending" && (
                    <>
                      <button
                        disabled={actionId === item.id}
                        onClick={() =>
                          void performAction(item, "approve")
                        }
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check className="size-4" />
                        Approve
                      </button>

                      <button
                        disabled={actionId === item.id}
                        onClick={() =>
                          void performAction(item, "reject")
                        }
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                      >
                        <X className="size-4" />
                        Reject
                      </button>
                    </>
                  )}

                  {(item.status === "approved" ||
                    item.status === "inactive") && (
                    <button
                      disabled={actionId === item.id}
                      onClick={() =>
                        void performAction(item, "status")
                      }
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2.5 text-xs font-bold text-gray-700 hover:border-red-300 hover:text-red-700 disabled:opacity-50"
                    >
                      {item.status === "approved" ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                      {item.status === "approved"
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  )}

                  {item.status === "rejected" && (
                    <button
                      disabled={actionId === item.id}
                      onClick={() =>
                        void performAction(item, "approve")
                      }
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      <Check className="size-4" />
                      Approve
                    </button>
                  )}

                  <button
                    disabled={actionId === item.id}
                    onClick={() =>
                      void performAction(item, "delete")
                    }
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

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
    </div>
  );
}
