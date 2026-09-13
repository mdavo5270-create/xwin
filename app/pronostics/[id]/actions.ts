"use server";

import { revalidatePath } from "next/cache";
import { followProno } from "@/lib/store";

export async function followAction(id: string) {
  await followProno(id);
  revalidatePath(`/pronostics/${id}`);
  revalidatePath("/pronostics");
  revalidatePath("/");
}
