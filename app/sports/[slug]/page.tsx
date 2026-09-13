import { redirect } from "next/navigation";

export default async function SportRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/pronos?sport=${slug}`);
}
