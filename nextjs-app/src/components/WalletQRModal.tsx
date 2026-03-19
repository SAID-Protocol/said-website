'use client';

import { QRCodeSVG } from 'qrcode.react';

interface WalletQRModalProps {
  address: string;
  onClose: () => void;
}

export default function WalletQRModal({ address, onClose }: WalletQRModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-950/95 backdrop-blur-xl p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-white transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">Deposit Wallet</h3>
          <p className="text-sm text-zinc-500 mb-5">Scan to send USDC on Solana</p>

          {/* QR Code */}
          <div className="inline-flex rounded-xl bg-white p-4 mb-5">
            <QRCodeSVG
              value={`solana:${address}`}
              size={200}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          {/* Address */}
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 mb-3">
            <code className="text-[12px] text-zinc-400 font-mono break-all leading-relaxed">{address}</code>
          </div>

          {/* Copy button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(address);
              const btn = document.getElementById('qr-copy-btn');
              if (btn) { btn.textContent = 'Copied ✓'; setTimeout(() => { btn.textContent = 'Copy Address'; }, 1500); }
            }}
            id="qr-copy-btn"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition"
          >
            Copy Address
          </button>

          <p className="text-[11px] text-zinc-600 mt-3">Only send SOL or SPL tokens (USDC) on Solana</p>
        </div>
      </div>
    </div>
  );
}
