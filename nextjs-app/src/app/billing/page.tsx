'use client';

import HostNavbar from '@/components/HostNavbar';
import AsciiBackground from '@/components/AsciiBackground';
import BillingPanel from '@/components/dashboard/BillingPanel';

export default function BillingPage() {
  return (
    <>
      <HostNavbar noCollapse />
      <AsciiBackground />
      <div className="relative z-10 min-h-screen px-4 pb-12 pt-24 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">Account</p>
              <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Billing</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Manage your subscription, wallet, and payment history.
              </p>
            </div>
            <a
              href="/dashboard"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              ← Dashboard
            </a>
          </div>
          <BillingPanel />
        </div>
      </div>
    </>
  );
}
