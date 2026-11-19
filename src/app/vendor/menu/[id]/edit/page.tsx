
import VendorMenuForm from "@/src/components/vendor/vendor-menu-form";

interface EditVendorMenuPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditVendorMenuPage({
  params,
}: EditVendorMenuPageProps) {
  const { id } = await params;

  return <VendorMenuForm itemId={id} />;
}
