
"use client";

import { useState } from "react";
import { apiFetch } from "@/src/lib/api-client";

interface ApiResult {
  success?: boolean;
  message?: string;
  user?: {
    id: string;
    name?: string;
    email: string;
    role: string;
    isBlocked: boolean;
  };
}

export default function AuthTestPage() {
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint: string) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await apiFetch(endpoint);
      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || `Request failed with status ${response.status}`
        );
        return;
      }

      setResult(data);
    } catch (err) {
      console.error("Authentication test failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the API."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-orange-50 px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl border border-orange-100 bg-white p-6 shadow-xl sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          PizzaHub Authentication Test
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Test Better Auth JWT authentication and Express role permissions.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => testEndpoint("/api/protected/me")}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Test My Account
          </button>

          <button
            onClick={() => testEndpoint("/api/protected/customer")}
            disabled={loading}
            className="rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            Test Customer Access
          </button>

          <button
            onClick={() => testEndpoint("/api/protected/vendor")}
            disabled={loading}
            className="rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
          >
            Test Vendor Access
          </button>

          <button
            onClick={() => testEndpoint("/api/protected/admin")}
            disabled={loading}
            className="rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            Test Admin Access
          </button>
        </div>

        {loading && (
          <p className="mt-6 text-sm text-gray-500">
            Verifying authentication...
          </p>
        )}

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <strong>Access denied or request failed:</strong>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <h2 className="font-semibold text-green-800">
              {result.message}
            </h2>

            {result.user && (
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Name:</strong> {result.user.name || "Not provided"}
                </p>
                <p>
                  <strong>Email:</strong> {result.user.email}
                </p>
                <p>
                  <strong>Role:</strong> {result.user.role}
                </p>
                <p>
                  <strong>Blocked:</strong>{" "}
                  {result.user.isBlocked ? "Yes" : "No"}
                </p>
              </div>
            )}

            <pre className="mt-4 overflow-x-auto rounded-lg bg-white p-3 text-xs text-gray-700">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
