"use server";

import { revalidatePath } from "next/cache";
import { followProno } from "@/lib/store";

export async function followAction(id: string) {
  followProno(id);
  revalidatePath(`/pronos/${id}`);
  revalidatePath("/pronos");
  revalidatePath("/");
}
