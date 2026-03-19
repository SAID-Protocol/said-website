'use client';

import { useEffect, useState } from 'react';
import { useFundWallet } from '@privy-io/react-auth/solana';
import { api, BillingInfo } from '@/lib/api';

const tierLabels: Record<string, string> = {
  starter: 'Starter',
  pro: 'Pro',
  power: 'Power',
};

const statusLabels: Record<string, { label: string; color: string }> = {
  none: { label: 'No Plan', color: 'text-zinc-400' },
  trial: { label: 'Trial', color: 'text-blue-400' },
  active: { label: 'Active', color: 'text-emerald-400' },
  grace: { label: 'Payment Due', color: 'text-amber-400' },
  paused: { label: 'Paused', color: 'text-red-400' },
  cancelled: { label: 'Cancelled', color: 'text-zinc-500' },
};

export default function BillingPanel() {
  const { fundWallet } = useFundWallet();
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBilling();
  }, []);

  async function loadBilling() {
    try {
      setLoading(true);
      const data = await api.getBilling();
      setBilling(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load billing');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button
          onClick={loadBilling}
          className="mt-3 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!billing) return null;

  const status = statusLabels[billing.billingStatus] || statusLabels.none;
  const isTrialActive = billing.billingStatus === 'trial' && billing.trialEndsAt;
  const trialDaysLeft = isTrialActive
    ? Math.max(0, Math.ceil((new Date(billing.trialEndsAt!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500">Wallet Balance</p>
            <p className="mt-1 text-3xl font-bold text-white">
              ${billing.walletBalance.toFixed(2)}
              <span className="ml-2 text-sm font-normal text-zinc-500">USDC</span>
            </p>
          </div>
          <button
            onClick={async () => {
              if (!billing?.privyWalletAddress) {
                alert('No wallet found. Please log out and log back in.');
                return;
              }
              try {
                await fundWallet(billing.privyWalletAddress, {
                  cluster: { name: 'mainnet-beta' },
                  defaultFundingMethod: 'card',
                });
                // Refresh billing after funding
                setTimeout(loadBilling, 5000);
              } catch (err) {
                console.error('Funding failed:', err);
              }
            }}
            className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-amber-400"
          >
            Add Funds
          </button>
        </div>
        {billing.privyWalletAddress && (
          <p className="mt-3 text-xs text-zinc-600">
            Wallet: {billing.privyWalletAddress.slice(0, 8)}...{billing.privyWalletAddress.slice(-6)}
          </p>
        )}
      </div>

      {/* Subscription Status */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          <p className="text-xs text-zinc-500">Plan</p>
          <p className="mt-1 text-lg font-medium text-white">
            {tierLabels[billing.tier] || billing.tier}
            <span className="ml-2 text-xs text-zinc-500">
              {billing.billingMode === 'byok' ? 'BYOK' : 'All-Inclusive'}
            </span>
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          <p className="text-xs text-zinc-500">Status</p>
          <p className={`mt-1 text-lg font-medium ${status.color}`}>
            {status.label}
            {isTrialActive && (
              <span className="ml-2 text-xs text-zinc-500">
                {trialDaysLeft}d left
              </span>
            )}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          <p className="text-xs text-zinc-500">Monthly</p>
          <p className="mt-1 text-lg font-medium text-white">
            {billing.monthlyAmountUsd ? `$${billing.monthlyAmountUsd}` : '—'}
            <span className="ml-1 text-xs text-zinc-500">/mo</span>
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          <p className="text-xs text-zinc-500">Next Billing</p>
          <p className="mt-1 text-lg font-medium text-white">
            {billing.nextBillingDate
              ? new Date(billing.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : isTrialActive
              ? new Date(billing.trialEndsAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : '—'}
          </p>
        </div>
      </div>

      {/* Low Balance Warning */}
      {billing.billingStatus === 'active' && billing.monthlyAmountUsd && billing.walletBalance < billing.monthlyAmountUsd && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-300">
            ⚠️ Your wallet balance (${billing.walletBalance.toFixed(2)}) is below your monthly charge (${billing.monthlyAmountUsd}).
            Add funds to avoid service interruption.
          </p>
        </div>
      )}

      {/* Grace Period Warning */}
      {billing.billingStatus === 'grace' && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-300">
            ⚠️ Payment failed. Your agent will be paused in 3 days if funds are not added.
          </p>
        </div>
      )}

      {/* Payment History */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <h3 className="mb-4 text-sm font-medium text-zinc-400">Payment History</h3>
        {billing.recentPayments.length === 0 ? (
          <p className="text-sm text-zinc-600">No payments yet</p>
        ) : (
          <div className="space-y-2">
            {billing.recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${
                    payment.status === 'success' ? 'bg-emerald-500' :
                    payment.status === 'failed' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                  <div>
                    <p className="text-sm text-white capitalize">{payment.type.replace('_', ' ')}</p>
                    <p className="text-xs text-zinc-600">
                      {new Date(payment.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">${payment.amountUsd.toFixed(2)}</p>
                  <p className="text-xs text-zinc-600">{payment.token}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
