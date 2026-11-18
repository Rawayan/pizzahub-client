
import type { Metadata } from "next";
import RegisterForm from "@/src/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your PizzaHub customer or vendor account.",
};

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </main>
  );
}
