"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { followProno } from "@/lib/store";

export async function followAction(id: string) {
  await followProno(id);
  revalidatePath(`/pronos/${id}`);
  revalidatePath("/pronos");
  revalidatePath("/");
  redirect(`/pronos/${id}/suivi`);
}
