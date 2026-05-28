import { redirect } from 'next/navigation';

export default async function LegacyAgentRedirect({
  params,
}: {
  params: Promise<{ wallet: string }>;
}) {
  const { wallet } = await params;
  redirect(`/agents/${wallet}`);
}
