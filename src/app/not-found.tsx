
import Link from "next/link";
import { ArrowLeft, Home, Pizza } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Pizza className="size-10" />
        </div>

        <p className="mt-7 text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
          Error 404
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          This page is off the menu!
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist, may have been
          moved, or is no longer available.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            <Home className="size-4" />
            Go to homepage
          </Link>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Browse menu
          </Link>
        </div>
      </div>
    </main>
  );
}
