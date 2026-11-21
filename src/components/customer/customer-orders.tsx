
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  PackageCheck,
  Pizza,
  Search,
  Store,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/src/lib/api-client";

type OrderStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

type StatusFilter = "all" | OrderStatus;

interface CustomerOrder {
  id: string;
  item: {
    id: string;
    itemName: string;
    category: string;
    price: number;
    images: string[];
    location: string;
  } | null;
  vendor: {
    id: string;
    name: string;
    businessName: string;
    image: string | null;
  } | null;
  deliveryDate: string;
  deliveryAddress: string;
  message: string;
  status: OrderStatus;
  createdAt: string;
}

const filters: { label: string; value: StatusFilter }[] = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
];

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const formatDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (value: number): string => {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
};

export default function CustomerOrders() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");

  const [cancellingId, setCancellingId] = useState("");
  const [confirmingId, setConfirmingId] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch("/api/customer/orders", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load your orders."
        );
      }

      setOrders(result.data?.orders || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading your orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void loadOrders());
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        filter === "all" || order.status === filter;

      const matchesSearch =
        !query ||
        order.item?.itemName.toLowerCase().includes(query) ||
        order.vendor?.businessName.toLowerCase().includes(query) ||
        order.deliveryAddress.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, filter]);

  const cancelOrder = async (orderId: string) => {
    try {
      setCancellingId(orderId);

      const response = await apiFetch(
        `/api/customer/orders/${orderId}/cancel`,
        {
          method: "PATCH",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to cancel this order."
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: "cancelled" }
            : order
        )
      );

      toast.success("Your order has been cancelled.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Order cancellation failed."
      );
    } finally {
      setCancellingId("");
      setConfirmingId("");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Page heading */}
      <div>
        <p className="text-sm font-semibold text-primary">
          Your activity
        </p>

        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
          My Orders
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          View your order history and manage pending requests.
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search pizza, restaurant, address..."
            className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                filter === item.value
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p className="font-semibold">{error}</p>

          <button
            type="button"
            onClick={() => void loadOrders()}
            className="mt-2 font-bold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex gap-4">
                <div className="size-24 rounded-xl bg-muted" />

                <div className="flex-1 space-y-3">
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-3 w-1/3 rounded bg-muted" />
                </div>
              </div>

              <div className="mt-5 h-10 rounded-lg bg-muted" />
            </div>
          ))}
        </div>
      ) : !error && filteredOrders.length === 0 ? (
        /* Empty state */
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {orders.length === 0 ? (
              <Pizza className="size-8" />
            ) : (
              <Search className="size-8" />
            )}
          </div>

          <h2 className="mt-5 text-xl font-extrabold">
            {orders.length === 0
              ? "You haven't placed an order yet"
              : "No matching orders"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {orders.length === 0
              ? "Explore the menu and place your first pizza delivery request."
              : "Try another search term or choose a different order status."}
          </p>

          {orders.length === 0 && (
            <Link
              href="/menu"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
            >
              Browse Pizza Menu
            </Link>
          )}
        </div>
      ) : (
        /* Orders list */
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-bold text-foreground">
                {filteredOrders.length}
              </span>{" "}
              {filteredOrders.length === 1 ? "order" : "orders"}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {filteredOrders.map((order) => (
              <article
                key={order.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md"
              >
                <div className="p-5">
                  {/* Item information */}
                  <div className="flex gap-4">
                    <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50">
                      {order.item?.images?.[0] ? (
                        <div
                          role="img"
                          aria-label={order.item.itemName}
                          className="size-full rounded-xl bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${order.item.images[0]})`,
                          }}
                        />
                      ) : (
                        <Pizza className="size-9 text-primary/50" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h2 className="truncate font-extrabold">
                            {order.item?.itemName ||
                              "Menu item unavailable"}
                          </h2>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {order.item?.category || "PizzaHub order"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                            statusStyles[order.status]
                          }`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </div>

                      <p className="mt-3 text-lg font-extrabold text-primary">
                        {order.item
                          ? formatPrice(order.item.price)
                          : "—"}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Store className="size-3.5 shrink-0" />

                        <span className="truncate">
                          {order.vendor?.businessName ||
                            "Restaurant unavailable"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery information */}
                  <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
                    <div className="flex items-start gap-2 text-sm">
                      <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Delivery date
                        </p>

                        <p className="mt-0.5 font-semibold">
                          {formatDate(order.deliveryDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <PackageCheck className="mt-0.5 size-4 shrink-0 text-primary" />

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Request date
                        </p>

                        <p className="mt-0.5 font-semibold">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm sm:col-span-2">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />

                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          Delivery address
                        </p>

                        <p className="mt-0.5 break-words font-medium">
                          {order.deliveryAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pending order cancellation */}
                  {order.status === "pending" && (
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3">
                      {confirmingId === order.id ? (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-xs font-semibold text-amber-900">
                            Are you sure you want to cancel this order?
                          </p>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setConfirmingId("")}
                              disabled={cancellingId === order.id}
                              className="rounded-lg border border-amber-300 px-3 py-2 text-xs font-bold text-amber-900 disabled:opacity-60"
                            >
                              Keep order
                            </button>

                            <button
                              type="button"
                              onClick={() => void cancelOrder(order.id)}
                              disabled={cancellingId === order.id}
                              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
                            >
                              {cancellingId === order.id
                                ? "Cancelling..."
                                : "Confirm cancel"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmingId(order.id)}
                          className="inline-flex items-center gap-2 text-xs font-bold text-red-700 hover:underline"
                        >
                          <X className="size-4" />
                          Cancel pending order
                        </button>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Order ID: {order.id.slice(-8).toUpperCase()}
                    </p>

                    <Link
                      href={`/customer/orders/${order.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
