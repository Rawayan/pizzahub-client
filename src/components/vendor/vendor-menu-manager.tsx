
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/src/lib/api-client";

interface VendorMenuItem {
  id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: "pending" | "approved" | "rejected" | "inactive";
  createdAt: string;
}

const statusStyles: Record<VendorMenuItem["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  inactive: "bg-gray-100 text-gray-700",
};

export default function VendorMenuManager() {
  const [items, setItems] = useState<VendorMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch("/api/vendor/menu-items");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load menu items.");
      }

      setItems(result.data.items as VendorMenuItem[]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void loadItems());
  }, [loadItems]);

  const changeAvailability = async (item: VendorMenuItem) => {
    try {
      setActionId(item.id);

      const response = await apiFetch(
        `/api/vendor/menu-items/${item.id}/availability`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isActive: item.status !== "approved",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to update availability."
        );
      }

      await loadItems();

      toast.success(
        item.status === "approved"
          ? "Menu item deactivated."
          : "Menu item activated."
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Update failed."
      );
    } finally {
      setActionId(null);
    }
  };

  const deleteItem = async (item: VendorMenuItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.itemName}"?`
    );

    if (!confirmed) return;

    try {
      setActionId(item.id);

      const response = await apiFetch(
        `/api/vendor/menu-items/${item.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to delete item.");
      }

      await loadItems();

      toast.success("Menu item deleted successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Delete failed."
      );
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div
        className="flex min-h-72 items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="sr-only">Loading your menu items...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">
            My Menu Items
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your restaurant&apos;s menu and availability.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadItems()}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted"
          >
            <RefreshCw className="size-4" />
            Refresh
          </button>

          <Link
            href="/vendor/menu/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
          >
            <Plus className="size-4" />
            Add Item
          </Link>
        </div>
      </div>

      {error && (
        <div
          className="rounded-xl border border-destructive/30 bg-card p-4 text-sm text-destructive"
          role="alert"
        >
          <p>{error}</p>

          <button
            type="button"
            onClick={() => void loadItems()}
            className="mt-3 font-bold underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      {!error && items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Plus className="size-7" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-foreground">
            Your menu is empty
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Add your first pizza or menu item to get started.
          </p>

          <Link
            href="/vendor/menu/new"
            className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Add Your First Item
          </Link>
        </div>
      ) : !error ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div
                role="img"
                aria-label={item.itemName}
                className="h-48 bg-muted bg-cover bg-center"
                style={{
                  backgroundImage: item.images[0]
                    ? `url("${item.images[0]}")`
                    : undefined,
                }}
              >
                {!item.images[0] && (
                  <div className="flex h-full items-center justify-center text-4xl">
                    🍕
                  </div>
                )}
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold text-foreground">
                      {item.itemName}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      {item.category}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyles[item.status]}`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
                  {item.description}
                </p>

                <div className="flex justify-between border-t border-border pt-3">
                  <span className="font-extrabold text-primary">
                    ৳{item.price.toFixed(2)}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    {item.location}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href={`/vendor/menu/${item.id}/edit`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => void deleteItem(item)}
                    disabled={actionId === item.id}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {actionId === item.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                    Delete
                  </button>
                </div>

                {(item.status === "approved" ||
                  item.status === "inactive") && (
                  <button
                    type="button"
                    onClick={() => void changeAvailability(item)}
                    disabled={actionId === item.id}
                    className="w-full rounded-lg bg-secondary px-3 py-2.5 text-sm font-bold text-secondary-foreground transition hover:opacity-80 disabled:opacity-50"
                  >
                    {actionId === item.id
                      ? "Updating..."
                      : item.status === "approved"
                        ? "Deactivate Item"
                        : "Activate Item"}
                  </button>
                )}

                {(item.status === "pending" ||
                  item.status === "rejected") && (
                  <p className="rounded-lg bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
                    {item.status === "pending"
                      ? "Waiting for admin approval."
                      : "This item was rejected. Edit it to resubmit for approval."}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
