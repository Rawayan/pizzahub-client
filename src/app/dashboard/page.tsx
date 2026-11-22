import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/src/lib/get-server-session";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Go to your PizzaHub dashboard.",
};

const dashboardPaths: Record<string, string> = {
  customer: "/customer/dashboard",
  vendor: "/vendor/dashboard",
  admin: "/admin/dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login?callbackURL=/dashboard");
  }

  const user = session.user as typeof session.user & {
    role?: string;
    isBlocked?: boolean;
  };

  if (user.isBlocked) {
    redirect("/login?error=account-blocked");
  }

  redirect(dashboardPaths[user.role ?? "customer"] ?? "/customer/dashboard");
}
