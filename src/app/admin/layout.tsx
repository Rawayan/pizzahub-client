
import { redirect } from "next/navigation";

import { getServerSession } from "@/src/lib/get-server-session";
import AdminDashboardLayout from "@/src/components/admin/admin-dashboard-layout";

interface AdminSessionUser {
  role?: string;
  isBlocked?: boolean;
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login?callbackURL=/admin/dashboard");
  }

  const user = session.user as typeof session.user & AdminSessionUser;

  if (user.isBlocked) {
    redirect("/login?error=blocked");
  }

  if (user.role !== "admin") {
    if (user.role === "vendor") {
      redirect("/vendor/dashboard");
    }

    if (user.role === "customer") {
      redirect("/customer/dashboard");
    }

    redirect("/");
  }

  return (
    <AdminDashboardLayout>
      {children}
    </AdminDashboardLayout>
  );
}
