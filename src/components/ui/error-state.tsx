
"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't complete your request. Please try again.",
  onRetry,
  retryLabel = "Try again",
}: ErrorStateProps) {
  return (
    <section
      className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-5 py-12 text-center"
      role="alert"
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-8" />
      </div>

      <h1 className="mt-5 text-2xl font-extrabold text-foreground">
        {title}
      </h1>

      <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
        {description}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          <RefreshCw className="size-4" />
          {retryLabel}
        </button>
      )}
    </section>
  );
}
