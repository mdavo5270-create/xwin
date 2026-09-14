import { redirect } from "next/navigation";
import { getMember } from "@/lib/members";
import { Splash } from "@/components/Splash";

export const dynamic = "force-dynamic";

export default async function Page() {
  const member = await getMember();
  if (member) redirect("/accueil");
  return <Splash />;
}
