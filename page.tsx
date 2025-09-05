"use client"
import { useState } from "react"
import dynamic from "next/dynamic"

const DiscControls = dynamic(() => import("@/components/DiscControls"), { ssr: false })
const Confetti = dynamic(() => import("@/components/Confetti"), { ssr: false })

export default function HomePage() {
  const [isMinting, setIsMinting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [mintSuccess, setMintSuccess] = useState(false)

  const handleMintClick = () => setShowConfirm(true)

  const handleConfirmMint = () => {
    setShowConfirm(false)
    setIsMinting(true) // 高速回転トリガー
    setTimeout(() => {
      setIsMinting(false)
      setMintSuccess(true) // 紙吹雪トリガー
      setTimeout(() => setMintSuccess(false), 1800) // Reduced from 2600ms to 1800ms
    }, 1400) // 疑似ミント時間
  }

  return (
    <main className="app-shell">
      <div className="bg-gradient" />
      <div className="bg-grain" />

      <header className="hero">
        <h1 className="title">SpinMint</h1>
        <p className="subtitle">Spin your profile, mint your NFT</p>
      </header>

      <section className="stage">
        <div id="disc" className={`disc-rotor ${isMinting ? "is-boost" : ""}`} aria-label="Spinning record">
          <img src="/logo.jpg" alt="Vinyl surface" className="disc-tex" draggable={false} />
          <div className="spindle">
            <div className="hub" />
            <div className="hole" />
          </div>
          <div className="specular" />
        </div>
      </section>

      <section className="actions">
        <button className="btn glass primary" onClick={handleMintClick}>
          Mint on Base Sepolia
        </button>
        <button className="btn glass secondary" disabled>
          Send NFT
        </button>
        
      </section>

      <DiscControls selector="#disc" boostWhenMint={isMinting || mintSuccess} />

      {showConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3 className="modal-title">Confirm Mint</h3>
            <div className="modal-meta">
              <div>
                <span>Network</span>
                <strong>Base Sepolia</strong>
              </div>
              <div>
                <span>Est. gas</span>
                <strong>~0.00021 ETH</strong>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn glass confirm" onClick={handleConfirmMint}>
                Confirm
              </button>
              <button className="btn glass cancel" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {mintSuccess && <Confetti key="confetti" />}
    </main>
  )
}
