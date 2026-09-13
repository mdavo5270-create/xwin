import { hasDatabase, sql } from "./db";

export type VoteChoice = "1" | "X" | "2";

declare global {
  var __xwinVotes: Map<string, VoteChoice> | undefined;
}
function mem() {
  if (!globalThis.__xwinVotes) globalThis.__xwinVotes = new Map();
  return globalThis.__xwinVotes;
}
function key(userId: string, pronoId: string) {
  return `${userId}:${pronoId}`;
}

export async function getVote(userId: string, pronoId: string): Promise<VoteChoice | null> {
  if (!hasDatabase()) return mem().get(key(userId, pronoId)) ?? null;
  const rows = await sql()`select choice from votes where user_id = ${userId} and prono_id = ${pronoId} limit 1`;
  const c = rows[0]?.choice;
  return c === "1" || c === "X" || c === "2" ? c : null;
}

export async function castVote(userId: string, pronoId: string, choice: VoteChoice) {
  const existing = await getVote(userId, pronoId);
  if (existing) return existing;
  if (!hasDatabase()) {
    mem().set(key(userId, pronoId), choice);
    return choice;
  }
  await sql()`
    insert into votes (user_id, prono_id, choice) values (${userId}, ${pronoId}, ${choice})
    on conflict (user_id, prono_id) do nothing
  `;
  return (await getVote(userId, pronoId)) ?? choice;
}
