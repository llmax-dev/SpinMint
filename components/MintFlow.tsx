"use client"

import { useState } from "react"

export default function MintFlow({
  onConfirmMint,
}: {
  onConfirmMint: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="space-y-3">
        <button className="btn btn-primary w-full text-base py-3" onClick={() => setOpen(true)}>
          Mint on Base Sepolia
        </button>

        <button className="btn w-full text-base py-3 opacity-60 pointer-events-none">Send NFT</button>

        <p className="text-center text-xs text-white/55">
          Preview mode — Connect wallet to enable features in production
        </p>
      </div>

      {/* Confirm Modal (no deps) */}
      {open && (
        <div className="modal">
          <div className="modal-card">
            <h3 className="h-arvo text-xl font-bold mb-2">Confirm Mint</h3>
            <p className="text-sm text-white/80 mb-4">
              Network: <b>Base Sepolia</b>
              <br />
              Est. gas: ~0.00021 ETH（プレビュー表示）
            </p>
            <div className="flex gap-2">
              <button className="btn flex-1" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary flex-1"
                onClick={() => {
                  setOpen(false)
                  onConfirmMint()
                }}
              >
                Confirm mint
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
