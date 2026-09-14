import { randomBytes } from "crypto";

export function makePublicId() {
  const raw = randomBytes(3).toString("hex").toUpperCase().slice(0, 5);
  return `XWIN-${raw}`;
}
