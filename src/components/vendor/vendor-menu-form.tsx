
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";

import { apiFetch } from "@/src/lib/api-client";

interface VendorMenuFormProps {
  itemId?: string;
}

interface MenuFormData {
  itemName: string;
  category: string;
  description: string;
  price: string;
  location: string;
  images: string[];
}

const initialForm: MenuFormData = {
  itemName: "",
  category: "",
  description: "",
  price: "",
  location: "",
  images: [],
};

export default function VendorMenuForm({
  itemId,
}: VendorMenuFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<MenuFormData>(initialForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loadingItem, setLoadingItem] = useState(Boolean(itemId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!itemId) return;

    let cancelled = false;

    const loadItem = async () => {
      try {
        setLoadingItem(true);

        const response = await apiFetch(
          `/api/vendor/menu-items/${itemId}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load menu item."
          );
        }

        if (cancelled) return;

        const item = result.data.item;

        setForm({
          itemName: item.itemName,
          category: item.category,
          description: item.description,
          price: String(item.price),
          location: item.location,
          images: item.images || [],
        });
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "Unable to load item.";

          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) setLoadingItem(false);
      }
    };

    void loadItem();

    return () => {
      cancelled = true;
    };
  }, [itemId]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      const message = "Please choose a JPG, PNG, or WEBP image.";

      setError(message);
      toast.error(message);
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const message = "Image size must be 5 MB or smaller.";

      setError(message);
      toast.error(message);
      event.target.value = "";
      return;
    }

    setError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (
      !form.itemName.trim() ||
      !form.category.trim() ||
      !form.description.trim() ||
      !form.location.trim() ||
      !form.price ||
      Number(form.price) <= 0
    ) {
      const message =
        "Please complete all required fields with valid values.";

      setError(message);
      toast.error(message);
      return;
    }

    if (!selectedFile && form.images.length === 0) {
      const message = "Please upload a menu item image.";

      setError(message);
      toast.error(message);
      return;
    }

    try {
      setSubmitting(true);

      let images = form.images;

      if (selectedFile) {
        const imageData = new FormData();
        imageData.append("image", selectedFile);

        const uploadResponse = await apiFetch(
          "/api/vendor/menu-images",
          {
            method: "POST",
            body: imageData,
          }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.success) {
          throw new Error(
            uploadResult.message || "Image upload failed."
          );
        }

        images = [uploadResult.data.url];
      }

      const payload = {
        itemName: form.itemName.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        location: form.location.trim(),
        images,
      };

      const response = await apiFetch(
        itemId
          ? `/api/vendor/menu-items/${itemId}`
          : "/api/vendor/menu-items",
        {
          method: itemId ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to save menu item."
        );
      }

      toast.success(
        result.message ||
          (itemId
            ? "Menu item updated successfully."
            : "Menu item submitted successfully.")
      );

      router.push("/vendor/menu");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while saving.";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingItem) {
    return (
      <div
        className="flex min-h-72 items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="sr-only">Loading menu item...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/vendor/menu"
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← Back to My Menu Items
        </Link>

        <h1 className="mt-3 text-3xl font-extrabold text-foreground">
          {itemId ? "Edit Menu Item" : "Add Menu Item"}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Enter the details of the item you want to offer to customers.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7"
      >
        {error && (
          <div
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="itemName" className="text-sm font-semibold">
            Item Name *
          </label>

          <input
            id="itemName"
            name="itemName"
            value={form.itemName}
            onChange={handleChange}
            maxLength={100}
            required
            placeholder="e.g. Chicken Supreme Pizza"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-semibold">
              Category *
            </label>

            <input
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              maxLength={50}
              required
              placeholder="e.g. Pizza"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-semibold">
              Price (৳) *
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="1"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
              placeholder="450"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-semibold">
            Description *
          </label>

          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                description: event.target.value,
              }))
            }
            maxLength={1500}
            rows={5}
            required
            placeholder="Describe the ingredients, taste, and size..."
            className="w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-semibold">
            Location (Area / City) *
          </label>

          <input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            maxLength={120}
            required
            placeholder="e.g. Dhanmondi, Dhaka"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold">
            Item Image *
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/40 px-5 py-8 text-center transition hover:border-primary">
            <ImagePlus className="size-9 text-primary" />

            <span className="mt-3 font-semibold text-foreground">
              Choose an image
            </span>

            <span className="mt-1 text-xs text-muted-foreground">
              JPG, PNG, or WEBP · Maximum 5 MB
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="sr-only"
            />
          </label>

          {(previewUrl || form.images[0]) && (
            <div className="relative overflow-hidden rounded-xl border border-border">
              <div
                role="img"
                aria-label="Selected menu item image preview"
                className="h-56 bg-muted bg-cover bg-center"
                style={{
                  backgroundImage: `url("${previewUrl || form.images[0]}")`,
                }}
              />

              {previewUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl("");
                  }}
                  className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white"
                  aria-label="Remove selected image"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-bold">Admin approval required</p>

          <p className="mt-1">
            New items and edited items are submitted as pending until an
            admin reviews them. They will not be visible to customers
            before approval.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/vendor/menu"
            className="rounded-xl border border-border px-5 py-3 text-center text-sm font-semibold text-foreground hover:bg-muted"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                {itemId ? "Save Changes" : "Submit Menu Item"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
