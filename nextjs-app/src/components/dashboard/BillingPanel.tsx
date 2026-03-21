'use client';

import { useEffect, useState } from 'react';
import { useFundWallet, useWallets, useSignAndSendTransaction } from '@privy-io/react-auth/solana';
import toast from 'react-hot-toast';
import { api, BillingInfo } from '@/lib/api';
import WalletQRModal from '@/components/WalletQRModal';
import { 
  address, 
  createSolanaRpc,
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  compileTransaction,
  getTransactionEncoder,
} from '@solana/kit';
import { findAssociatedTokenPda, getTransferInstruction, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token';

const USDC_MINT = address('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const TREASURY_WALLET = address('HUpEuDs3FC4T3xMZ3n8EGe16QLJFSnjbd1Kzh6C22YyP');
const RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=be1d86a2-00ff-4405-b693-1399154a5380';

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
  const { wallets, ready: walletsReady } = useWallets();
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [paying, setPaying] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

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

  async function handlePayNow() {
    if (!billing || !billing.monthlyAmountUsd || !billing.privyWalletAddress) {
      toast.error('Missing billing information');
      return;
    }

    const monthlyAmount = billing.monthlyAmountUsd;
    
    if (billing.walletBalance < monthlyAmount) {
      toast.error(`Insufficient balance. You have $${billing.walletBalance.toFixed(2)} but need $${monthlyAmount}`);
      return;
    }

    const privyWallet = walletsReady ? wallets?.find(w => w.standardWallet?.name === 'Privy') : null;
    if (!privyWallet) {
      toast.error('Wallet not found. Please refresh and try again.');
      return;
    }

    setPaying(true);
    const loadingToast = toast.loading('Processing payment...');

    try {
      const { getLatestBlockhash } = createSolanaRpc(RPC_URL);
      const { value: latestBlockhash } = await getLatestBlockhash().send();
      
      const userAddress = address(billing.privyWalletAddress);
      const usdcAmount = BigInt(Math.floor(monthlyAmount * 1_000_000)); // USDC has 6 decimals
      
      // Derive Associated Token Accounts for USDC
      const [userTokenAccount] = await findAssociatedTokenPda({
        mint: USDC_MINT,
        owner: userAddress,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
      });
      
      const [treasuryTokenAccount] = await findAssociatedTokenPda({
        mint: USDC_MINT,
        owner: TREASURY_WALLET,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
      });
      
      // Build USDC transfer instruction
      const transferInstruction = getTransferInstruction({
        source: userTokenAccount,
        destination: treasuryTokenAccount,
        authority: userAddress,
        amount: usdcAmount,
      });
      
      // Create transaction using @solana/kit
      const transaction = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayer(userAddress, tx),
        (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions([transferInstruction], tx),
        (tx) => compileTransaction(tx),
        (tx) => new Uint8Array(getTransactionEncoder().encode(tx))
      );
      
      console.log('[Pay] Transferring', monthlyAmount, 'USDC to treasury');
      
      // Sign and send using Privy
      const result = await signAndSendTransaction({
        transaction,
        wallet: privyWallet,
      });
      
      const signatureStr = Buffer.from(result.signature).toString('base64');
      console.log('[Pay] Transaction confirmed:', signatureStr);
      
      // Notify backend
      await api.payManually(signatureStr);
      
      toast.dismiss(loadingToast);
      toast.success(`Payment successful! Subscription activated.`);
      
      // Refresh billing
      await loadBilling();
      
    } catch (err) {
      console.error('[Pay] Error:', err);
      toast.dismiss(loadingToast);
      const message = err instanceof Error ? err.message : 'Payment failed';
      if (message.includes('User rejected') || message.includes('user rejected')) {
        toast.error('Payment cancelled');
      } else {
        toast.error(message);
      }
    } finally {
      setPaying(false);
    }
  }

  async function handleWithdraw() {
    if (!billing || !billing.privyWalletAddress) {
      toast.error('Missing wallet information');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > billing.walletBalance) {
      toast.error(`Insufficient balance. You have $${billing.walletBalance.toFixed(2)}`);
      return;
    }

    if (!withdrawAddress || withdrawAddress.length < 32) {
      toast.error('Please enter a valid Solana address');
      return;
    }

    const privyWallet = walletsReady ? wallets?.find(w => w.standardWallet?.name === 'Privy') : null;
    if (!privyWallet) {
      toast.error('Wallet not found. Please refresh and try again.');
      return;
    }

    setWithdrawing(true);
    const loadingToast = toast.loading('Processing withdrawal...');

    try {
      const { getLatestBlockhash } = createSolanaRpc(RPC_URL);
      const { value: latestBlockhash } = await getLatestBlockhash().send();
      
      const userAddress = address(billing.privyWalletAddress);
      const destinationAddress = address(withdrawAddress);
      const usdcAmount = BigInt(Math.floor(amount * 1_000_000)); // USDC has 6 decimals
      
      // Derive Associated Token Accounts
      const [userTokenAccount] = await findAssociatedTokenPda({
        mint: USDC_MINT,
        owner: userAddress,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
      });
      
      const [destTokenAccount] = await findAssociatedTokenPda({
        mint: USDC_MINT,
        owner: destinationAddress,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
      });
      
      // Build USDC transfer instruction
      const transferInstruction = getTransferInstruction({
        source: userTokenAccount,
        destination: destTokenAccount,
        authority: userAddress,
        amount: usdcAmount,
      });
      
      // Create transaction using @solana/kit
      const transaction = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayer(userAddress, tx),
        (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions([transferInstruction], tx),
        (tx) => compileTransaction(tx),
        (tx) => new Uint8Array(getTransactionEncoder().encode(tx))
      );
      
      console.log('[Withdraw] Transferring', amount, 'USDC to', withdrawAddress);
      
      // Sign and send using Privy
      const result = await signAndSendTransaction({
        transaction,
        wallet: privyWallet,
      });
      
      const signatureStr = Buffer.from(result.signature).toString('base64');
      console.log('[Withdraw] Transaction confirmed:', signatureStr);
      
      toast.dismiss(loadingToast);
      toast.success(`Withdrawal successful! $${amount} USDC sent.`);
      
      // Reset form and close modal
      setWithdrawAddress('');
      setWithdrawAmount('');
      setShowWithdraw(false);
      
      // Refresh billing
      await loadBilling();
      
    } catch (err) {
      console.error('[Withdraw] Error:', err);
      toast.dismiss(loadingToast);
      const message = err instanceof Error ? err.message : 'Withdrawal failed';
      if (message.includes('User rejected') || message.includes('user rejected')) {
        toast.error('Withdrawal cancelled');
      } else {
        toast.error(message);
      }
    } finally {
      setWithdrawing(false);
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
            <p className="text-xs text-zinc-500">Wallet Balances</p>
            <div className="mt-1 flex items-baseline gap-4">
              <div>
                <span className="text-3xl font-bold text-white">
                  ${billing.walletBalance.toFixed(2)}
                </span>
                <span className="ml-2 text-sm font-normal text-zinc-500">USDC</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-purple-400">
                  {billing.solBalance?.toFixed(4) || '0.0000'}
                </span>
                <span className="ml-2 text-sm font-normal text-zinc-500">SOL</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                if (!billing?.privyWalletAddress) {
                  toast.error('No wallet found. Please log out and log back in.');
                  return;
                }
                try {
                  await fundWallet({
                    address: billing.privyWalletAddress,
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
            {billing.walletBalance > 0 && (
              <button
                onClick={() => setShowWithdraw(true)}
                className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Withdraw
              </button>
            )}
          </div>
        </div>
        {billing.privyWalletAddress && (
          <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-xs text-zinc-500 mb-1">Your Wallet Address</p>
            <div className="flex items-center gap-2">
              <code className="text-sm text-zinc-300 font-mono break-all">{billing.privyWalletAddress}</code>
              <button
                onClick={() => setShowQR(true)}
                className="shrink-0 rounded-md border border-white/10 bg-white/5 p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition"
                title="Show QR Code"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="3" height="3" />
                  <rect x="18" y="18" width="3" height="3" />
                </svg>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(billing.privyWalletAddress!);
                  const btn = document.getElementById('copy-wallet-btn');
                  if (btn) { btn.textContent = '✓'; setTimeout(() => { btn.textContent = 'Copy'; }, 1500); }
                }}
                id="copy-wallet-btn"
                className="shrink-0 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition"
              >
                Copy
              </button>
            </div>
            <p className="text-[11px] text-zinc-600 mt-1.5">Send USDC (Solana) to this address to fund your account</p>
            {showQR && (
              <WalletQRModal address={billing.privyWalletAddress!} onClose={() => setShowQR(false)} />
            )}
          </div>
        )}

        {/* Low SOL Warning */}
        {billing.privyWalletAddress && (!billing.solBalance || billing.solBalance < 0.001) && (
          <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-300">SOL Needed for Transactions</p>
                <p className="mt-1 text-xs text-amber-200/70">
                  Your wallet needs a small amount of SOL (~0.01 SOL) to pay for transaction fees when withdrawing or making payments.
                </p>
                <p className="mt-2 text-xs text-amber-200/70">
                  <strong>Send 0.01 SOL</strong> to the wallet address above to enable transactions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pay Now Button */}
      {billing.monthlyAmountUsd && 
       billing.billingStatus !== 'active' && 
       billing.walletBalance >= billing.monthlyAmountUsd && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-emerald-300">Ready to Activate</h3>
              <p className="mt-1 text-sm text-emerald-200/70">
                You have sufficient funds to activate your {tierLabels[billing.tier]} subscription
                ({billing.billingMode === 'byok' ? 'BYOK' : 'All-Inclusive'}) for ${billing.monthlyAmountUsd}/mo.
              </p>
            </div>
            <button
              onClick={handlePayNow}
              disabled={paying}
              className="shrink-0 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paying ? 'Processing...' : `Pay $${billing.monthlyAmountUsd}`}
            </button>
          </div>
        </div>
      )}

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

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Withdraw USDC</h2>
              <button
                onClick={() => {
                  setShowWithdraw(false);
                  setWithdrawAddress('');
                  setWithdrawAmount('');
                }}
                className="text-zinc-400 hover:text-white transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Destination Address (Solana)
                </label>
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  placeholder="Enter Solana address..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Amount (USDC)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    max={billing.walletBalance}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-16 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    onClick={() => setWithdrawAmount(billing.walletBalance.toString())}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-amber-500 hover:bg-white/10 transition"
                  >
                    Max
                  </button>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  Available: ${billing.walletBalance.toFixed(2)} USDC
                </p>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowWithdraw(false);
                    setWithdrawAddress('');
                    setWithdrawAmount('');
                  }}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={withdrawing || !withdrawAddress || !withdrawAmount}
                  className="flex-1 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {withdrawing ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
