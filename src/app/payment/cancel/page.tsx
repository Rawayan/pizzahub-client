
import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-background px-5 py-12">
      <section className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <CreditCard className="size-10" />
        </div>

        <h1 className="mt-6 text-3xl font-black text-foreground">
          Checkout Cancelled
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          You cancelled the Premium subscription checkout. No Premium access
          was activated. You can return to your subscription page whenever
          you are ready.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/vendor/subscription"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            <ArrowLeft className="size-4" />
            Return to Subscription
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
