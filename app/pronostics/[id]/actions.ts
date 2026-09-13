"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/members";
import { castVote, type VoteChoice } from "@/lib/votes";
import { ensureSchema } from "@/lib/schema";

export async function voteAction(form: FormData) {
  const member = await getMember();
  const id = String(form.get("id") ?? "");
  const raw = String(form.get("choice") ?? "");
  if (!member) redirect(`/connexion?next=/pronostics/${id}`);
  if (!id || (raw !== "1" && raw !== "X" && raw !== "2")) redirect(`/pronostics/${id}`);
  await ensureSchema();
  await castVote(member.id, id, raw as VoteChoice);
  revalidatePath(`/pronostics/${id}`);
}
