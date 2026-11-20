
import Link from "next/link";
import { Inbox, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <section className="rounded-2xl border border-dashed border-border bg-card px-5 py-14 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Inbox className="size-8" />
      </div>

      <h2 className="mt-5 text-xl font-extrabold text-foreground">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          {actionLabel}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </section>
  );
}
