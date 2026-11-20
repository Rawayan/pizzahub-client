
"use client";
import "./globals.css";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  useEffect(() => {
    console.error("PizzaHub root application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-5 text-gray-900">
        <main className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-50 text-3xl">
            🍕
          </div>

          <h1 className="mt-5 text-2xl font-extrabold">
            PizzaHub encountered a problem
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-600">
            Something unexpected happened while starting the
            application. Please try again.
          </p>

          {error.digest && (
            <p className="mt-3 text-xs text-gray-500">
              Error reference: {error.digest}
            </p>
          )}

          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
