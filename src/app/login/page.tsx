
import type { Metadata } from "next";
import LoginForm from "@/src/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your PizzaHub account.",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
