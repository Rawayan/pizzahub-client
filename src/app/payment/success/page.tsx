
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Clock, XCircle } from "lucide-react";

import { apiFetch } from "@/src/lib/api-client";

type VerificationState = "checking" | "active" | "pending" | "error";

export default function PaymentSuccessPage() {
  const [state, setState] = useState<VerificationState>("checking");
  const [message, setMessage] = useState(
    "Verifying your subscription payment..."
  );

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      const sessionId = new URLSearchParams(window.location.search).get(
        "session_id"
      );

      if (!sessionId) {
        setState("error");
        setMessage("The Checkout Session ID is missing.");
        return;
      }

      for (let attempt = 0; attempt < 10; attempt += 1) {
        if (cancelled) return;

        try {
          const response = await apiFetch(
            `/api/vendor/subscription/verify-session?session_id=${encodeURIComponent(sessionId)}`
          );

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.message || "Payment verification failed.");
          }

          if (result.data?.premiumActive) {
            if (cancelled) return;

            setState("active");
            setMessage("Your Premium subscription is now active.");
            return;
          }

          if (cancelled) return;

          setState("pending");
          setMessage(
            "Stripe received your Checkout Session. We are waiting for the verified webhook confirmation."
          );
        } catch (error) {
          if (cancelled) return;

          setState("pending");
          setMessage(
            error instanceof Error
              ? error.message
              : "We are still checking your payment."
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      if (!cancelled) {
        setState("pending");
        setMessage(
          "Your payment is still being processed. Please check your subscription page again shortly."
        );
      }
    };

    void verify();

    return () => {
      cancelled = true;
    };
  }, []);

  const Icon =
    state === "active"
      ? CheckCircle2
      : state === "error"
        ? XCircle
        : state === "pending"
          ? Clock
          : Loader2;

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-background px-5 py-12">
      <section className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-secondary">
          <Icon
            className={`size-10 ${
              state === "active"
                ? "text-green-600"
                : state === "error"
                  ? "text-destructive"
                  : state === "pending"
                    ? "text-amber-600"
                    : "animate-spin text-primary"
            }`}
          />
        </div>

        <h1 className="mt-6 text-3xl font-black text-foreground">
          {state === "active"
            ? "Premium Activated!"
            : state === "error"
              ? "Verification Issue"
              : state === "pending"
                ? "Payment Processing"
                : "Checking Payment"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {message}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/vendor/subscription"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            View Subscription
          </Link>

          <Link
            href="/vendor/dashboard"
            className="rounded-xl border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-secondary"
          >
            Vendor Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
