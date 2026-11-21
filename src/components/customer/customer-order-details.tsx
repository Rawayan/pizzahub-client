
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Pizza,
  Store,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/src/lib/api-client";
import OrderStatusTimeline from "@/src/components/customer/order-status-timeline";

type OrderStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

interface CustomerOrderDetailsData {
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

interface CustomerOrderDetailsProps {
  orderId: string;
}

const formatDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatPrice = (value: number): string => {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
};

const statusInfo: Record<
  OrderStatus,
  {
    label: string;
    description: string;
    className: string;
    icon: typeof Clock3;
  }
> = {
  pending: {
    label: "Pending",
    description:
      "Your request is waiting for the restaurant to respond.",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
    icon: Clock3,
  },
  accepted: {
    label: "Accepted",
    description: "The restaurant has accepted your order.",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    description: "The restaurant was unable to accept this order.",
    className:
      "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    icon: XCircle,
  },
  cancelled: {
    label: "Cancelled",
    description: "This order has been cancelled.",
    className:
      "bg-muted text-muted-foreground",
    icon: XCircle,
  },
};

export default function CustomerOrderDetails({
  orderId,
}: CustomerOrderDetailsProps) {
  const [order, setOrder] =
    useState<CustomerOrderDetailsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch(
        `/api/customer/orders/${orderId}`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load this order."
        );
      }

      setOrder(result.data.order);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load this order."
      );
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    queueMicrotask(() => void loadOrder());
  }, [loadOrder]);

  const handleCancel = async () => {
    try {
      setCancelling(true);

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

      setOrder(result.data.order);
      setConfirmCancel(false);

      toast.success("Your order has been cancelled.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Order cancellation failed."
      );
    } finally {
      setCancelling(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  // Error or unavailable order
  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card px-6 py-16 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
          <Package className="size-7" />
        </div>

        <h1 className="mt-5 text-xl font-extrabold">
          Unable to open this order
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {error || "This order could not be found."}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => void loadOrder()}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold transition hover:bg-muted"
          >
            Try again
          </button>

          <Link
            href="/customer/orders"
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStatus = statusInfo[order.status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back navigation */}
      <Link
        href="/customer/orders"
        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to My Orders
      </Link>

      {/* Heading */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">
            Order information
          </p>

          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            Order Details
          </h1>

          <p className="mt-2 break-all text-sm text-muted-foreground">
            Order ID: {order.id}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${currentStatus.className}`}
        >
          <StatusIcon className="size-4" />
          {currentStatus.label}
        </span>
      </div>

      {/* Pizza information */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-orange-50 dark:bg-orange-950/30 sm:size-44">
            {order.item?.images?.[0] ? (
              <div
                role="img"
                aria-label={order.item.itemName}
                className="size-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${order.item.images[0]})`,
                }}
              />
            ) : (
              <Pizza className="size-14 text-primary/50" />
            )}
          </div>

          <div className="flex flex-1 flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              {order.item?.category || "PizzaHub order"}
            </p>

            <h2 className="mt-2 text-2xl font-extrabold">
              {order.item?.itemName || "Menu item unavailable"}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {order.item?.location ||
                "Restaurant location unavailable"}
            </p>

            <p className="mt-4 text-2xl font-extrabold text-primary">
              {order.item
                ? formatPrice(order.item.price)
                : "Price unavailable"}
            </p>
          </div>
        </div>
      </section>

      {/* Order status timeline */}
      <OrderStatusTimeline
        status={order.status}
        createdAt={order.createdAt}
      />

      {/* Delivery and restaurant information */}
      <section className="grid gap-5 md:grid-cols-2">
        {/* Delivery information */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <CalendarDays className="size-5 text-primary" />

            <h2 className="font-extrabold">
              Delivery information
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Requested delivery date
              </p>

              <p className="mt-1 text-sm font-semibold">
                {formatDate(order.deliveryDate)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Delivery address
              </p>

              <p className="mt-1 flex items-start gap-2 text-sm font-semibold leading-6">
                <MapPin className="mt-1 size-4 shrink-0 text-primary" />

                <span className="break-words">
                  {order.deliveryAddress}
                </span>
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Additional message
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sm leading-6">
                {order.message || "No additional instructions."}
              </p>
            </div>
          </div>
        </div>

        {/* Restaurant information */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Store className="size-5 text-primary" />

            <h2 className="font-extrabold">
              Restaurant information
            </h2>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50 text-primary dark:bg-orange-950/30">
              {order.vendor?.image ? (
                <div
                  role="img"
                  aria-label={order.vendor.businessName}
                  className="size-full rounded-xl bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${order.vendor.image})`,
                  }}
                />
              ) : (
                <Store className="size-5" />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate font-bold">
                {order.vendor?.businessName ||
                  "Restaurant unavailable"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {order.vendor?.name ||
                  "Vendor information unavailable"}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground">
              Order request date
            </p>

            <p className="mt-1 text-sm font-semibold">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      </section>

      {/* Pending order cancellation */}
      {order.status === "pending" && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
          <h2 className="font-extrabold text-amber-950 dark:text-amber-200">
            Need to cancel this order?
          </h2>

          <p className="mt-1 text-sm leading-6 text-amber-900/80 dark:text-amber-200/80">
            You can cancel this request while it is still pending.
            Once the restaurant accepts or rejects it, cancellation
            through this page will no longer be available.
          </p>

          {confirmCancel ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setConfirmCancel(false)}
                disabled={cancelling}
                className="rounded-xl border border-amber-300 px-4 py-2.5 text-sm font-bold text-amber-950 disabled:opacity-60 dark:border-amber-700 dark:text-amber-200"
              >
                Keep order
              </button>

              <button
                type="button"
                onClick={() => void handleCancel()}
                disabled={cancelling}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelling
                  ? "Cancelling..."
                  : "Confirm cancellation"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmCancel(true)}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Cancel this order
            </button>
          )}
        </section>
      )}
    </div>
  );
}
