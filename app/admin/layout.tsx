import { isAdmin } from "@/lib/admin-auth";
import { AdminChrome } from "@/components/AdminChrome";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ok = await isAdmin();
  if (!ok) return children;
  return <AdminChrome>{children}</AdminChrome>;
}
