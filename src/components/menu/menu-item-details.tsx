"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "@/src/lib/api-client";
import {
  ArrowLeft,
  CheckCircle2,
  ImageOff,
  MapPin,
  Pizza,
  ShoppingBag,
  Store,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface VendorInfo {
  id: string;
  name: string;
  businessName: string;
  image: string;
}

interface MenuItem {
  id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  createdAt: string;
  vendorId: string;
  vendor: VendorInfo | null;
}

interface MenuItemResponse {
  success: boolean;
  message: string;
  data?: {
    item: MenuItem;
  };
}

interface MenuItemDetailsProps {
  itemId: string;
  viewerId: string;
  viewerRole: string;
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);

export default function MenuItemDetails({
  itemId,
  viewerId,
  viewerRole,
}: MenuItemDetailsProps) {
  const [item, setItem] = useState<MenuItem | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const router = useRouter();

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /**
   * Places an order for the currently displayed menu item.
   */
  const handlePlaceOrder = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setOrderError("");

    if (!deliveryDate || deliveryDate < getTodayDate()) {
      setOrderError(
        "Please choose today or a future delivery date."
      );
      return;
    }

    if (deliveryAddress.trim().length < 10) {
      setOrderError(
        "Please enter a complete delivery address (at least 10 characters)."
      );
      return;
    }

    try {
      setPlacingOrder(true);

      const response = await apiFetch("/api/customer/orders", {
        method: "POST",
        body: JSON.stringify({
          itemId,
          deliveryDate,
          deliveryAddress: deliveryAddress.trim(),
          message: message.trim(),
        }),
      });

      const result = await response.json();

      if (
        !response.ok ||
        !result.success ||
        !result.data?.order?.id
      ) {
        throw new Error(
          result.message || "Unable to place your order."
        );
      }

      toast.success("Order placed", {
        description:
          result.message ||
          "Your order has been placed successfully.",
      });

      router.push(
        `/customer/orders/${result.data.order.id}`
      );
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Order placement failed. Please try again.";

      setOrderError(errorMessage);
      toast.error("Order not placed", {
        description: errorMessage,
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  /**
   * Fetches the selected menu item.
   */
  useEffect(() => {
    const controller = new AbortController();

    const fetchItem = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/menu-items/${encodeURIComponent(itemId)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const result: MenuItemResponse =
          await response.json();

        if (
          !response.ok ||
          !result.success ||
          !result.data?.item
        ) {
          throw new Error(
            result.message || "Unable to load this menu item."
          );
        }

        setItem(result.data.item);
        setSelectedImage(0);
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading this item."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchItem();

    return () => controller.abort();
  }, [itemId]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-background px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-5 w-36 rounded bg-muted" />

          <div className="grid gap-10 md:grid-cols-2">
            <div className="aspect-square rounded-3xl bg-muted" />

            <div className="space-y-5 py-4">
              <div className="h-6 w-28 rounded bg-muted" />
              <div className="h-10 w-3/4 rounded bg-muted" />
              <div className="h-5 w-full rounded bg-muted" />
              <div className="h-5 w-2/3 rounded bg-muted" />
              <div className="h-12 w-1/2 rounded bg-muted" />
              <div className="h-14 w-full rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary">
            <ImageOff className="size-8" />
          </span>

          <h1 className="mt-5 text-2xl font-extrabold text-foreground">
            Menu item unavailable
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {error || "We could not find this menu item."}
          </p>

          <Link
            href="/menu"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            <ArrowLeft className="size-4" />
            Back to Browse Menu
          </Link>
        </div>
      </main>
    );
  }

  const images = item.images?.filter(Boolean) ?? [];
  const activeImage = images[selectedImage];

  const isOwnVendorItem =
    viewerRole === "vendor" &&
    Boolean(item.vendor?.id) &&
    item.vendor?.id === viewerId;

  const canOrder =
    viewerRole === "customer" && !isOwnVendorItem;

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/menu"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to Browse Menu
        </Link>

        <div className="grid items-start gap-9 lg:grid-cols-2 lg:gap-14">
          {/* Image gallery */}
          <section>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-border bg-secondary shadow-sm">
              {activeImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeImage}
                  alt={item.itemName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-primary/70">
                  <Pizza className="size-24" />
                  <span className="text-sm font-semibold">
                    PizzaHub
                  </span>
                </div>
              )}

              <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-card/95 px-4 py-2 text-xs font-bold text-primary shadow-sm">
                {item.category}
              </span>
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={selectedImage === index}
                    className={`aspect-square overflow-hidden rounded-xl border-2 transition ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={`${item.itemName} image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Item information */}
          <section className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-primary">
                {item.category}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                <CheckCircle2 className="size-3.5" />
                Approved
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {item.itemName}
            </h1>

            <p className="mt-5 text-3xl font-extrabold text-primary">
              {formatPrice(item.price)}
            </p>

            <div className="mt-7 border-t border-border pt-6">
              <h2 className="text-lg font-bold text-foreground">
                About this item
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-8 text-muted-foreground">
                {item.description ||
                  "A delicious menu item prepared with care."}
              </p>
            </div>

            <div className="mt-7 space-y-4 border-t border-border pt-6">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <MapPin className="size-5" />
                </span>

                <div>
                  <p className="text-sm font-bold text-foreground">
                    Restaurant location
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.location || "Location not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Store className="size-5" />
                </span>

                <div>
                  <p className="text-sm font-bold text-foreground">
                    Vendor
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.vendor?.businessName ||
                      item.vendor?.name ||
                      "PizzaHub Restaurant"}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer order form */}
            <div className="mt-8 rounded-2xl border border-border bg-card p-5">
              {canOrder ? (
                <form
                  onSubmit={handlePlaceOrder}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-foreground">
                    <ShoppingBag className="size-5 text-primary" />

                    <h2 className="font-bold">
                      Place your order
                    </h2>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      Order item
                    </span>

                    <span className="font-bold text-foreground">
                      {item.itemName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      Item price
                    </span>

                    <span className="text-lg font-extrabold text-primary">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <div>
                    <label
                      htmlFor="delivery-date"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Delivery date
                    </label>

                    <input
                      id="delivery-date"
                      type="date"
                      required
                      min={getTodayDate()}
                      value={deliveryDate}
                      onChange={(event) =>
                        setDeliveryDate(event.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="delivery-address"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Delivery address
                    </label>

                    <textarea
                      id="delivery-address"
                      required
                      minLength={10}
                      maxLength={500}
                      rows={3}
                      value={deliveryAddress}
                      onChange={(event) =>
                        setDeliveryAddress(event.target.value)
                      }
                      placeholder="Enter your full delivery address"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="order-message"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Special instructions{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </label>

                    <textarea
                      id="order-message"
                      maxLength={500}
                      rows={2}
                      value={message}
                      onChange={(event) =>
                        setMessage(event.target.value)
                      }
                      placeholder="Any delivery or preparation instructions?"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  {orderError && (
                    <p
                      role="alert"
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                    >
                      {orderError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={placingOrder}
                    className="w-full rounded-xl bg-primary px-5 py-3.5 font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {placingOrder
                      ? "Placing order..."
                      : "Place Order"}
                  </button>

                  <p className="text-xs leading-5 text-muted-foreground">
                    Your order will be sent to the restaurant for
                    confirmation. No online payment is collected here.
                  </p>
                </form>
              ) : viewerRole === "vendor" ? (
                <p className="text-sm leading-7 text-muted-foreground">
                  Vendors cannot place customer orders
                  {isOwnVendorItem
                    ? " for their own menu items"
                    : ""}
                  .
                </p>
              ) : viewerRole === "admin" ? (
                <p className="text-sm leading-7 text-muted-foreground">
                  Admin accounts cannot place customer orders.
                </p>
              ) : (
                <p className="text-sm leading-7 text-muted-foreground">
                  Ordering is available to signed-in customer accounts.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}