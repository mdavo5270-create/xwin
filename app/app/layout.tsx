import { redirect } from "next/navigation";
import { getMember } from "@/lib/members";
import { AppChrome } from "@/components/AppChrome";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const member = await getMember();
  if (!member) redirect("/connexion?next=/app");
  return <AppChrome member={member}>{children}</AppChrome>;
}
