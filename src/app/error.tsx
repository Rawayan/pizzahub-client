
"use client";

import { useEffect } from "react";
import Link from "next/link";
import ErrorState from "@/src/components/ui/error-state";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error("PizzaHub application error:", error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <ErrorState
        title="We couldn't load this page"
        description="An unexpected problem occurred. You can try loading the page again or return to the PizzaHub homepage."
        onRetry={reset}
        retryLabel="Reload page"
      />

      {error.digest && (
        <p className="-mt-6 mb-6 text-xs text-muted-foreground">
          Error reference: {error.digest}
        </p>
      )}

      <Link
        href="/"
        className="text-sm font-semibold text-primary hover:underline"
      >
        Return to homepage
      </Link>
    </main>
  );
}
