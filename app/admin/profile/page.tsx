import { redirect } from "next/navigation";
import { adminHref } from "@/lib/admin-path";
export default function Page() {
  redirect(adminHref("security"));
}
