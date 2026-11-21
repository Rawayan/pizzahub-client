"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  Check,
  ClipboardList,
  Clock3,
  LoaderCircle,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Pizza,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";

import { toast } from "sonner";

import { apiFetch } from "@/src/lib/api-client";

// ============================================
// Types
// ============================================

type OrderStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

type OrderFilter = "all" | OrderStatus;

interface VendorOrder {
  id: string;

  item: {
    id: string;
    itemName: string;
    category: string;
    price: number;
    images: string[];
  } | null;

  customer: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;

  deliveryDate: string;
  deliveryAddress: string;
  message: string;
  status: OrderStatus;
  createdAt: string;
}

interface OrdersResponse {
  success: boolean;
  message: string;
  data?: {
    orders: VendorOrder[];
    total: number;
  };
}

interface UpdateResponse {
  success: boolean;
  message: string;
}

// ============================================
// Helpers
// ============================================

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
};

const formatDateTime = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
};

const statusClasses: Record<OrderStatus, string> = {
  pending:
    "border-amber-200 bg-amber-50 text-amber-700",

  accepted:
    "border-green-200 bg-green-50 text-green-700",

  rejected:
    "border-red-200 bg-red-50 text-red-700",

  cancelled:
    "border-gray-200 bg-gray-100 text-gray-600",
};

const statusLabel: Record<OrderStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

// ============================================
// Order Card
// ============================================

function OrderCard({
  order,
  updating,
  onAccept,
  onReject,
}: {
  order: VendorOrder;
  updating: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const isPending = order.status === "pending";

  const imageUrl = order.item?.images?.[0];

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/40 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Order ID
          </p>

          <p className="mt-1 font-mono text-sm font-bold text-card-foreground">
            #{order.id.slice(-8).toUpperCase()}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${statusClasses[order.status]}`}
        >
          <span className="size-2 rounded-full bg-current" />
          {statusLabel[order.status]}
        </span>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_1fr]">
        {/* Item information */}

        <div>
          <div className="flex gap-4">
            <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={order.item?.itemName || "Pizza"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Pizza className="size-10 text-primary/60" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ordered item
              </p>

              <h3 className="mt-1 text-lg font-extrabold text-card-foreground">
                {order.item?.itemName || "Menu item unavailable"}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {order.item?.category || "Category unavailable"}
              </p>

              {order.item && (
                <p className="mt-2 font-bold text-primary">
                  {formatPrice(order.item.price)}
                </p>
              )}
            </div>
          </div>

          {/* Customer */}

          <div className="mt-6 rounded-xl border border-border p-4">
            <div className="mb-3 flex items-center gap-2">
              <UserRound className="size-4 text-primary" />

              <h4 className="text-sm font-bold text-card-foreground">
                Customer information
              </h4>
            </div>

            <p className="font-semibold text-card-foreground">
              {order.customer?.name || "Customer unavailable"}
            </p>

            <p className="mt-1 flex items-center gap-2 break-all text-sm text-muted-foreground">
              <Mail className="size-4 shrink-0" />

              {order.customer?.email || "Email unavailable"}
            </p>
          </div>
        </div>

        {/* Delivery information */}

        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" />

              <h4 className="text-sm font-bold text-card-foreground">
                Delivery date
              </h4>
            </div>

            <p className="text-sm text-muted-foreground">
              {formatDate(order.deliveryDate)}
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <MapPin className="size-4 text-primary" />

              <h4 className="text-sm font-bold text-card-foreground">
                Delivery address
              </h4>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              {order.deliveryAddress}
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <MessageSquare className="size-4 text-primary" />

              <h4 className="text-sm font-bold text-card-foreground">
                Special instructions
              </h4>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              {order.message || "No additional instructions."}
            </p>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs text-muted-foreground">
              Requested on
            </p>

            <p className="mt-1 text-sm font-medium text-card-foreground">
              {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}

      {isPending && (
        <div className="flex flex-col gap-3 border-t border-border bg-secondary/30 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onReject(order.id)}
            disabled={updating}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-card px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            {updating ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <X className="size-4" />
            )}

            Reject order
          </button>

          <button
            type="button"
            onClick={() => onAccept(order.id)}
            disabled={updating}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {updating ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}

            Accept order
          </button>
        </div>
      )}

      {!isPending && (
        <div className="border-t border-border bg-secondary/30 px-5 py-3">
          <p className="text-xs font-medium text-muted-foreground">
            This order has already been processed. Its status can no longer
            be changed.
          </p>
        </div>
      )}
    </article>
  );
}

// ============================================
// Loading Skeleton
// ============================================

function OrderSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="flex justify-between gap-4">
        <div className="h-5 w-32 rounded bg-muted" />
        <div className="h-7 w-24 rounded-full bg-muted" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="flex gap-4">
          <div className="size-24 rounded-xl bg-muted" />

          <div className="flex-1 space-y-3">
            <div className="h-5 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-4 w-1/3 rounded bg-muted" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-4/5 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// Main Vendor Orders Component
// ============================================

export default function VendorOrders() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<OrderFilter>("all");

  const [updatingId, setUpdatingId] = useState<string | null>(
    null
  );

  // ------------------------------------------
  // Fetch orders
  // ------------------------------------------

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch(
        "/api/orders/vendor-orders",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result: OrdersResponse = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(
          result.message || "Unable to load customer orders."
        );
      }

      setOrders(result.data.orders);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while loading orders.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void fetchOrders());
  }, [fetchOrders]);

  // ------------------------------------------
  // Accept or reject an order
  // ------------------------------------------

  const updateStatus = async (
    orderId: string,
    action: "accept" | "reject"
  ) => {
    if (updatingId) {
      return;
    }

    setUpdatingId(orderId);

    try {
      const response = await apiFetch(
        `/api/orders/${orderId}/${action}`,
        {
          method: "PATCH",
        }
      );

      const result: UpdateResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to update order."
        );
      }

      const updatedStatus: OrderStatus =
        action === "accept" ? "accepted" : "rejected";

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: updatedStatus,
              }
            : order
        )
      );

      toast.success(result.message);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to update order.";

      toast.error(message);

      // Refresh to keep the UI synchronized with the server.
      await fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  // ------------------------------------------
  // Filter and search
  // ------------------------------------------

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        filter === "all" || order.status === filter;

      const matchesSearch =
        !normalizedSearch ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        order.item?.itemName
          .toLowerCase()
          .includes(normalizedSearch) ||
        order.customer?.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        order.customer?.email
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, filter]);

  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter(
        (order) => order.status === "pending"
      ).length,
      accepted: orders.filter(
        (order) => order.status === "accepted"
      ).length,
      rejected: orders.filter(
        (order) => order.status === "rejected"
      ).length,
      cancelled: orders.filter(
        (order) => order.status === "cancelled"
      ).length,
    };
  }, [orders]);

  // ------------------------------------------
  // Render
  // ------------------------------------------

  return (
    <section className="space-y-7">
      {/* Page heading */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <ClipboardList className="size-5" />

            <span className="text-xs font-bold uppercase tracking-[0.18em]">
              Vendor Dashboard
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground">
            Customer Orders
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Review incoming orders, check delivery instructions, and
            manage your restaurant&apos;s order requests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchOrders()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-card-foreground shadow-sm transition hover:bg-secondary disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw
            className={`size-4 ${loading ? "animate-spin" : ""}`}
          />

          Refresh orders
        </button>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-muted-foreground">
              Total orders
            </span>

            <Package className="size-5 text-primary" />
          </div>

          <p className="mt-3 text-3xl font-black text-card-foreground">
            {counts.all}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-amber-700">
              Pending
            </span>

            <Clock3 className="size-5 text-amber-600" />
          </div>

          <p className="mt-3 text-3xl font-black text-amber-800">
            {counts.pending}
          </p>
        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-green-700">
              Accepted
            </span>

            <Check className="size-5 text-green-600" />
          </div>

          <p className="mt-3 text-3xl font-black text-green-800">
            {counts.accepted}
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-red-700">
              Rejected
            </span>

            <X className="size-5 text-red-600" />
          </div>

          <p className="mt-3 text-3xl font-black text-red-800">
            {counts.rejected}
          </p>
        </div>
      </div>

      {/* Search and filters */}

      <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by order ID, customer, email, or pizza..."
            className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              "all",
              "pending",
              "accepted",
              "rejected",
              "cancelled",
            ] as OrderFilter[]
          ).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition ${
                filter === value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-background text-muted-foreground hover:bg-secondary"
              }`}
            >
              {value} (
              {counts[value]}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}

      {error && !loading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-bold text-red-700">
            Unable to load customer orders
          </p>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void fetchOrders()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading */}

      {loading && (
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <OrderSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Orders */}

      {!loading && !error && filteredOrders.length > 0 && (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              updating={updatingId === order.id}
              onAccept={(id) =>
                void updateStatus(id, "accept")
              }
              onReject={(id) =>
                void updateStatus(id, "reject")
              }
            />
          ))}
        </div>
      )}

      {/* Empty state */}

      {!loading && !error && filteredOrders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-16 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary">
            <ClipboardList className="size-8" />
          </div>

          <h2 className="mt-5 text-xl font-extrabold text-card-foreground">
            {orders.length === 0
              ? "No customer orders yet"
              : "No matching orders"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {orders.length === 0
              ? "New customer orders will appear here when customers place orders for your menu items."
              : "Try changing the search term or selecting a different order status."}
          </p>

          {(search || filter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </section>
  );
}