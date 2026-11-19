import { redirect } from "next/navigation";
import { getServerSession } from "@/src/lib/get-server-session";
import CustomerDashboardLayout from "@/src/components/customer/customer-dashboard-layout";

export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login?callbackURL=/customer/dashboard");
  }

  const user = session.user as typeof session.user & {
    role?: string;
    isBlocked?: boolean;
  };

  if (user.isBlocked) {
    redirect("/login?error=account-blocked");
  }

  if (user.role !== "customer") {
    if (user.role === "vendor") {
      redirect("/vendor/dashboard");
    }

    if (user.role === "admin") {
      redirect("/admin/dashboard");
    }

    redirect("/");
  }

  return (
    <CustomerDashboardLayout
      userName={user.name || "Customer"}
      userEmail={user.email || ""}
    >
      {children}
    </CustomerDashboardLayout>
  );
}