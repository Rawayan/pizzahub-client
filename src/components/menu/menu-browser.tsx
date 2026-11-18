"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Pizza,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface MenuItem {
  id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  createdAt: string;
}

interface MenuResponse {
  success: boolean;
  message: string;
  data?: {
    items: MenuItem[];
    categories: string[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

type SortOption =
  | "newest"
  | "oldest"
  | "price-low"
  | "price-high"
  | "name";

const PAGE_SIZE = 12;

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);

function MenuCard({ item }: { item: MenuItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = item.images?.[0];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <Link
        href={`/menu/${item.id}`}
        className="block"
        aria-label={`View ${item.itemName}`}
      >
        <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-secondary">
          {imageUrl && !imageFailed ? (
            // Menu images are uploaded by vendors and may come from external hosts.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={item.itemName}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-primary/70">
              <Pizza className="size-16" />
              <span className="text-xs font-semibold">PizzaHub</span>
            </div>
          )}

          <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-card/95 px-3 py-1 text-xs font-bold text-primary shadow-sm">
            {item.category}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-1 text-lg font-extrabold text-card-foreground transition group-hover:text-primary">
            {item.itemName}
          </h2>

          <span className="shrink-0 text-base font-extrabold text-primary">
            {formatPrice(item.price)}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
          {item.description || "Freshly prepared and ready to enjoy."}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="line-clamp-1 text-xs text-muted-foreground">
            {item.location || "Available on PizzaHub"}
          </span>

          <Link
            href={`/menu/${item.id}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            Details
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function MenuCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[16/10] animate-pulse bg-muted" />
      <div className="space-y-4 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default function MenuBrowser() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMenu = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
          sort,
        });

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (category !== "all") {
          params.set("category", category);
        }

        if (minPrice.trim()) {
          params.set("minPrice", minPrice.trim());
        }

        if (maxPrice.trim()) {
          params.set("maxPrice", maxPrice.trim());
        }

        const response = await fetch(
          `${API_BASE_URL}/api/menu-items?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
            signal,
          }
        );

        const result: MenuResponse = await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(
            result.message || "Unable to load menu items."
          );
        }

        setItems(result.data.items);
        setCategories(result.data.categories);
        setTotal(result.data.pagination.total);
        setTotalPages(result.data.pagination.totalPages);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the menu."
        );
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [page, search, category, sort, minPrice, maxPrice]
  );

  useEffect(() => {
    const controller = new AbortController();

    // Debounce search input to avoid sending a request for every keystroke.
    const timeout = window.setTimeout(() => {
      void fetchMenu(controller.signal);
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [fetchMenu]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const updateCategory = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const updateSort = (value: SortOption) => {
    setSort(value);
    setPage(1);
  };

  const updateMinPrice = (value: string) => {
    setMinPrice(value);
    setPage(1);
  };

  const updateMaxPrice = (value: string) => {
    setMaxPrice(value);
    setPage(1);
  };

  const hasFilters =
    search.trim() !== "" ||
    category !== "all" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    sort !== "newest";

  return (
    <main className="min-h-screen bg-background">
      {/* Page heading */}
      <section className="relative overflow-hidden border-b border-border bg-secondary/50 px-4 py-14 sm:px-6 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2 text-sm font-bold text-primary">
              <Pizza className="size-4" />
              Explore PizzaHub
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Find Your Next
              <span className="block text-primary">Favorite Pizza.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              Browse delicious menu items from local restaurants.
              Search, filter, and discover something you will love.
            </p>
          </div>
        </div>
      </section>

      {/* Menu browsing */}
      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                Our Menu
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
                Delicious choices for you
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {loading
                  ? "Finding delicious options..."
                  : `${total} approved ${total === 1 ? "item" : "items"} available`}
              </p>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 self-start rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary lg:self-auto"
              >
                <X className="size-4" />
                Clear filters
              </button>
            )}
          </div>

          {/* Search and filters */}
          <div className="mb-8 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(220px,1.5fr)_minmax(160px,1fr)_minmax(160px,1fr)]">
              <div>
                <label
                  htmlFor="menu-search"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Search menu
                </label>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="menu-search"
                    type="search"
                    value={search}
                    onChange={(event) => updateSearch(event.target.value)}
                    placeholder="Search pizza by name..."
                    className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="menu-category"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Category
                </label>

                <select
                  id="menu-category"
                  value={category}
                  onChange={(event) => updateCategory(event.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                >
                  <option value="all">All categories</option>
                  {categories.map((itemCategory) => (
                    <option key={itemCategory} value={itemCategory}>
                      {itemCategory}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="menu-sort"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Sort by
                </label>

                <select
                  id="menu-sort"
                  value={sort}
                  onChange={(event) =>
                    updateSort(event.target.value as SortOption)
                  }
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <SlidersHorizontal className="size-4 text-primary" />
                Price range (BDT)
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:max-w-xl">
                <div>
                  <label
                    htmlFor="min-price"
                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                  >
                    Minimum price
                  </label>
                  <input
                    id="min-price"
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(event) => updateMinPrice(event.target.value)}
                    placeholder="e.g. 200"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>

                <div>
                  <label
                    htmlFor="max-price"
                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                  >
                    Maximum price
                  </label>
                  <input
                    id="max-price"
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(event) => updateMaxPrice(event.target.value)}
                    placeholder="e.g. 1000"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              {minPrice && maxPrice && Number(minPrice) > Number(maxPrice) && (
                <p className="mt-2 text-xs font-medium text-destructive">
                  Minimum price cannot be greater than maximum price.
                </p>
              )}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <MenuCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-12 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <X className="size-7" />
              </div>

              <h3 className="mt-4 text-xl font-bold text-foreground">
                We could not load the menu
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                {error}
              </p>

              <button
                type="button"
                onClick={() => {
                  const controller = new AbortController();
                  void fetchMenu(controller.signal);
                }}
                className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-16 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
                <Pizza className="size-8" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-foreground">
                No menu items found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                We could not find any approved menu items matching
                your search. Try another name, category, or price range.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Menu grid */}
          {!loading && !error && items.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => {
                      setPage((current) => Math.max(1, current - 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </button>

                  <span className="px-2 text-sm font-semibold text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => {
                      setPage((current) =>
                        Math.min(totalPages, current + 1)
                      );
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
