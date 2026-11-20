
interface LoadingStateProps {
  title?: string;
  description?: string;
}

export default function LoadingState({
  title = "Preparing your PizzaHub experience",
  description = "Please wait while we load the information.",
}: LoadingStateProps) {
  return (
    <section
      className="mx-auto flex min-h-[55vh] w-full max-w-5xl flex-col justify-center px-4 py-12"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
            🍕
          </div>

          <h1 className="mt-5 text-xl font-extrabold text-foreground">
            {title}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="h-40 animate-pulse bg-muted" />

              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded-lg bg-muted" />
                <div className="h-4 w-full animate-pulse rounded-lg bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded-lg bg-muted" />
                <div className="mt-4 h-9 w-1/2 animate-pulse rounded-lg bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
