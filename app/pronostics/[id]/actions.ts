"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/members";
import { followProno } from "@/lib/store";

export async function followAction(id: string) {
  const member = await getMember();
  if (!member) redirect(`/connexion?next=/pronostics/${id}`);
  await followProno(id);
  revalidatePath(`/pronostics/${id}`);
  revalidatePath("/pronostics");
  revalidatePath("/");
}
