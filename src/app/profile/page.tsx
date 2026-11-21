
"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Loader2,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/src/lib/api-client";

interface Profile {
  id: string;
  name: string;
  email: string;
  image: string;
  role: "customer" | "vendor" | "admin" | string;
  businessName: string;
  subscriptionPlan: "free" | "premium" | string;
  subscriptionExpiresAt: string | null;
}

interface ProfileApiResponse {
  success: boolean;
  message: string;
  data?: Profile;
}

const initialProfile: Profile = {
  id: "",
  name: "",
  email: "",
  image: "",
  role: "",
  businessName: "",
  subscriptionPlan: "free",
  subscriptionExpiresAt: null,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [businessName, setBusinessName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isVendor = profile.role === "vendor";
  const isAdmin = profile.role === "admin";

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        setLoading(true);

        const response = await apiFetch("/api/users/me");
        const result =
          (await response.json()) as ProfileApiResponse;

        if (!response.ok || !result.success || !result.data) {
          throw new Error(
            result.message || "Unable to load your profile."
          );
        }

        if (!active) return;

        setProfile(result.data);
        setName(result.data.name);
        setImage(result.data.image);
        setBusinessName(result.data.businessName);
      } catch (error) {
        if (!active) return;

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load your profile.";

        toast.error(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedImage = image.trim();
    const trimmedBusinessName = businessName.trim();

    if (trimmedName.length < 2 || trimmedName.length > 60) {
      toast.error("Name must contain between 2 and 60 characters.");
      return;
    }

    if (
      trimmedImage &&
      !/^https?:\/\/.+/i.test(trimmedImage)
    ) {
      toast.error("Please enter a valid HTTP or HTTPS image URL.");
      return;
    }

    if (
      isVendor &&
      (trimmedBusinessName.length < 2 ||
        trimmedBusinessName.length > 100)
    ) {
      toast.error(
        "Business name must contain between 2 and 100 characters."
      );
      return;
    }

    const payload: {
      name: string;
      image: string;
      businessName?: string;
    } = {
      name: trimmedName,
      image: trimmedImage,
    };

    if (isVendor) {
      payload.businessName = trimmedBusinessName;
    }

    try {
      setSaving(true);

      const response = await apiFetch("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      const result =
        (await response.json()) as ProfileApiResponse;

      if (!response.ok || !result.success || !result.data) {
        throw new Error(
          result.message || "Unable to update your profile."
        );
      }

      setProfile(result.data);
      setName(result.data.name);
      setImage(result.data.image);
      setBusinessName(result.data.businessName);

      toast.success(
        result.message || "Profile updated successfully."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while updating your profile.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-9 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[75vh] bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href={
            isVendor
              ? "/vendor/dashboard"
              : isAdmin
                ? "/admin/dashboard"
                : profile.role === "customer"
                  ? "/customer/dashboard"
                  : "/"
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
            Account Settings
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Profile Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage your personal information and keep your
            PizzaHub account up to date.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Profile summary */}

          <section className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-full border-4 border-primary/10 bg-primary/10">
                <UserRound className="size-12 text-primary" />

                {image.trim() ? (
                  <div
                    role="img"
                    aria-label="Profile preview"
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${image.trim()})`,
                    }}
                  />
                ) : null}
              </div>

              <h2 className="mt-4 text-xl font-bold text-foreground">
                {name || profile.name || "Your Name"}
              </h2>

              <p className="mt-1 break-all text-sm text-muted-foreground">
                {profile.email}
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold capitalize text-primary">
                <ShieldCheck className="size-4" />
                {profile.role}
              </span>

              <div className="mt-6 w-full border-t border-border pt-5 text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Subscription Plan
                </p>

                <p className="mt-2 font-bold capitalize text-foreground">
                  {profile.subscriptionPlan}
                </p>

                {profile.subscriptionExpiresAt && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Expires:{" "}
                    {new Date(
                      profile.subscriptionExpiresAt
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Editable profile form */}

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <div className="mb-7 flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound className="size-5" />
              </span>

              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update your profile details below.
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-bold text-foreground"
                >
                  Full Name
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  minLength={2}
                  maxLength={60}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {isVendor && (
                <div>
                  <label
                    htmlFor="business-name"
                    className="mb-2 block text-sm font-bold text-foreground"
                  >
                    Business / Restaurant Name
                  </label>

                  <input
                    id="business-name"
                    type="text"
                    value={businessName}
                    onChange={(event) =>
                      setBusinessName(event.target.value)
                    }
                    placeholder="Enter your restaurant name"
                    minLength={2}
                    maxLength={100}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-bold text-foreground"
                >
                  Email Address
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground outline-none"
                />

                <p className="mt-2 text-xs text-muted-foreground">
                  Your email address cannot be changed here.
                </p>
              </div>

              <div>
                <label
                  htmlFor="profile-image"
                  className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground"
                >
                  <Camera className="size-4 text-primary" />
                  Profile Image URL
                  <span className="font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </label>

                <input
                  id="profile-image"
                  type="url"
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  placeholder="https://example.com/profile-image.jpg"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <p className="mt-2 text-xs text-muted-foreground">
                  Paste a publicly accessible image URL. Leave
                  it empty to remove your current profile image.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />

                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Account security
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Your account role, account status, and
                      subscription plan are protected. You
                      cannot change these settings through
                      profile editing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setName(profile.name);
                    setImage(profile.image);
                    setBusinessName(profile.businessName);
                  }}
                  disabled={saving}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground transition hover:bg-muted disabled:opacity-50"
                >
                  Reset Changes
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="size-4 text-green-600" />
          Your profile changes are saved securely to your PizzaHub account.
        </div>
      </div>
    </main>
  );
}
