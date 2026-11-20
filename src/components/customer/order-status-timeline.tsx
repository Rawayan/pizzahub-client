
"use client";

import {
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

type OrderStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

interface OrderStatusTimelineProps {
  status: OrderStatus;
  createdAt: string;
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

const decisionDetails: Record<
  OrderStatus,
  {
    title: string;
    description: string;
    className: string;
  }
> = {
  pending: {
    title: "Waiting for restaurant",
    description:
      "Your order request has been sent. The restaurant has not responded yet.",
    className: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  },
  accepted: {
    title: "Accepted by restaurant",
    description:
      "Good news! The restaurant has accepted your order.",
    className: "border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300",
  },
  rejected: {
    title: "Rejected by restaurant",
    description:
      "The restaurant was unable to accept this order.",
    className: "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
  },
  cancelled: {
    title: "Order cancelled",
    description:
      "This order request has been cancelled.",
    className: "border-border bg-muted text-muted-foreground",
  },
};

export default function OrderStatusTimeline({
  status,
  createdAt,
}: OrderStatusTimelineProps) {
  const decision = decisionDetails[status];

  const DecisionIcon =
    status === "pending"
      ? Clock3
      : status === "accepted"
        ? CheckCircle2
        : XCircle;

  return (
    <section
      className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7"
      aria-label="Order status timeline"
    >
      <div>
        <p className="text-sm font-semibold text-primary">
          Order progress
        </p>

        <h2 className="mt-1 text-xl font-extrabold">
          Order Status Timeline
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Follow the progress of your order from submission to the
          restaurant&apos;s decision.
        </p>
      </div>

      <ol className="mt-7">
        {/* First milestone: order placed */}
        <li className="relative flex gap-4 pb-8">
          <div className="absolute left-[15px] top-9 h-full w-px bg-green-500/40" />

          <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
            <CheckCircle2 className="size-5" />
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <p className="font-bold text-foreground">
              Order placed
            </p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Your order request was successfully submitted to
              PizzaHub.
            </p>

            <p className="mt-2 text-xs font-semibold text-muted-foreground">
              {formatDate(createdAt)}
            </p>
          </div>
        </li>

        {/* Second milestone: restaurant decision */}
        <li className="relative flex gap-4">
          <div
            className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ${
              status === "pending"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                : status === "accepted"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                  : status === "rejected"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                    : "bg-muted text-muted-foreground"
            }`}
          >
            <DecisionIcon className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${decision.className}`}
            >
              {decision.title}
            </span>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {decision.description}
            </p>

            {status === "pending" && (
              <p className="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
                This step is still in progress.
              </p>
            )}
          </div>
        </li>
      </ol>

      <div className="mt-7 rounded-xl border border-border bg-muted/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Current status
        </p>

        <p className="mt-1 font-extrabold text-foreground">
          {decision.title}
        </p>
      </div>
    </section>
  );
}
