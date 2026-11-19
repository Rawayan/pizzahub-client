
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Search,
  RefreshCw,
  ShieldCheck,
  ShieldOff,
  Store,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { apiFetch } from "@/src/lib/api-client";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "customer" | "vendor";
  isBlocked: boolean;
  businessName?: string;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: string | null;
}

interface UsersResponse {
  success: boolean;
  message?: string;
  data: {
    users: AdminUser[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface UserDetailsResponse {
  success: boolean;
  message?: string;
  data: {
    user: AdminUser;
  };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] =
    useState<AdminUser | null>(null);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [blocked, setBlocked] = useState("all");

  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        search,
        role,
        blocked,
        page: String(page),
        limit: "10",
      });

      const response = await apiFetch(
        `/api/admin/users?${params.toString()}`,
        { cache: "no-store" }
      );

      const result = (await response.json()) as UsersResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load users.");
      }

      setUsers(result.data.users);
      setTotalUsers(result.data.pagination.total);
      setTotalPages(
        Math.max(1, result.data.pagination.totalPages)
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load users.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [search, role, blocked, page]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const viewUser = async (userId: string) => {
    if (selectedUser?.id === userId) {
      setSelectedUser(null);
      return;
    }

    try {
      setDetailsLoading(true);

      const response = await apiFetch(
        `/api/admin/users/${userId}`,
        { cache: "no-store" }
      );

      const result =
        (await response.json()) as UserDetailsResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load user details."
        );
      }

      setSelectedUser(result.data.user);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to load user details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const toggleBlock = async (user: AdminUser) => {
    const action = user.isBlocked ? "unblock" : "block";

    try {
      setActionId(user.id);

      const response = await apiFetch(
        `/api/admin/users/${user.id}/${action}`,
        { method: "PATCH" }
      );

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || `Unable to ${action} this user.`
        );
      }

      toast.success(result.message || `User ${action}ed successfully.`);

      setSelectedUser((current) =>
        current?.id === user.id
          ? { ...current, isBlocked: !user.isBlocked }
          : current
      );

      await loadUsers();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : `Unable to ${action} this user.`
      );
    } finally {
      setActionId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-red-600">
            Administration
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
            Manage Users
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Search, review, and manage customer and vendor accounts.
          </p>
        </div>

        <div className="rounded-xl border border-orange-100 bg-white px-4 py-3">
          <p className="text-xs text-gray-500">Registered accounts</p>
          <p className="text-2xl font-extrabold text-gray-900">
            {totalUsers.toLocaleString()}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              void loadUsers();
            }}
            className="flex gap-2"
          >
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search name, email, or business..."
                className="w-full rounded-xl border border-orange-100 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Search
            </button>
          </form>

          <select
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-orange-100 bg-white px-3 py-3 text-sm outline-none focus:border-red-400"
          >
            <option value="all">All roles</option>
            <option value="customer">Customers</option>
            <option value="vendor">Vendors</option>
          </select>

          <select
            value={blocked}
            onChange={(event) => {
              setBlocked(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-orange-100 bg-white px-3 py-3 text-sm outline-none focus:border-red-400"
          >
            <option value="all">All account statuses</option>
            <option value="false">Active accounts</option>
            <option value="true">Blocked accounts</option>
          </select>

          <button
            onClick={() => void loadUsers()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-red-300 hover:text-red-700"
          >
            <RefreshCw className="size-4" />
            Refresh
          </button>
        </div>
      </section>

      {selectedUser && (
        <section className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-red-600">
                Account details
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-gray-900">
                {selectedUser.name}
              </h2>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="rounded-lg p-2 text-gray-500 hover:bg-orange-50 hover:text-red-600"
              aria-label="Close user details"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                {selectedUser.email}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Role</p>
              <p className="mt-1 text-sm font-semibold capitalize text-gray-900">
                {selectedUser.role}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Business</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {selectedUser.businessName || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Subscription</p>
              <p className="mt-1 text-sm font-semibold capitalize text-gray-900">
                {selectedUser.subscriptionPlan || "—"}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
        {loading || detailsLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-xl bg-orange-50"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="font-semibold text-red-700">{error}</p>
            <button
              onClick={() => void loadUsers()}
              className="mt-3 rounded-xl bg-red-600 px-5 py-2 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto size-10 text-orange-300" />
            <h3 className="mt-3 font-bold text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-orange-50/70 text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">User</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 font-semibold">Business</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-orange-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-100 font-bold text-orange-800">
                          {user.image ? (
                            <span
                              className="size-full bg-cover bg-center"
                              style={{
                                backgroundImage: `url("${user.image}")`,
                              }}
                            />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-bold text-gray-900">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold capitalize text-orange-800">
                        {user.role === "vendor" ? (
                          <Store className="size-3.5" />
                        ) : (
                          <UserRound className="size-3.5" />
                        )}
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {user.businessName || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          user.isBlocked
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => void viewUser(user.id)}
                          className="rounded-lg border border-orange-200 px-3 py-2 text-xs font-bold text-gray-700 hover:border-orange-400"
                        >
                          Details
                        </button>

                        <button
                          onClick={() => void toggleBlock(user)}
                          disabled={actionId === user.id}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold disabled:opacity-50 ${
                            user.isBlocked
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          {user.isBlocked ? (
                            <ShieldCheck className="size-3.5" />
                          ) : (
                            <ShieldOff className="size-3.5" />
                          )}
                          {actionId === user.id
                            ? "Please wait..."
                            : user.isBlocked
                              ? "Unblock"
                              : "Block"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
          >
            Previous
          </button>

          <button
            disabled={page >= totalPages || loading}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
