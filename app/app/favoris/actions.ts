"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getMember } from "@/lib/members";
import { toggleFavorite } from "@/lib/favorites";

export async function favoriteAction(form: FormData) {
  const member = await getMember();
  if (!member) redirect("/connexion");
  const id = String(form.get("id") ?? "");
  if (!id) return;
  await toggleFavorite(member.id, id);
  revalidatePath("/app/favoris");
  revalidatePath(`/pronostics/${id}`);
}
