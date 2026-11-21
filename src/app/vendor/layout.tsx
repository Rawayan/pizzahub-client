
import { redirect } from "next/navigation";

import { getServerSession } from "@/src/lib/get-server-session";
import VendorDashboardLayout from "@/src/components/vendor/vendor-dashboard-layout";

interface SessionUser {
  name?: string;
  email?: string;
  role?: string;
  isBlocked?: boolean;
}

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login?callbackURL=/vendor/dashboard");
  }

  const user = session.user as typeof session.user & SessionUser;

  if (user.isBlocked) {
    redirect("/login?error=account-restricted");
  }

  if (user.role !== "vendor") {
    if (user.role === "customer") {
      redirect("/customer/dashboard");
    }

    if (user.role === "admin") {
      redirect("/admin/dashboard");
    }

    redirect("/");
  }

  return (
    <VendorDashboardLayout
      vendorName={user.name || user.email || "Vendor"}
    >
      {children}
    </VendorDashboardLayout>
  );
}
