"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { modalVariants, backdropVariants, progressRingVariants } from "@/lib/animations"
import { mintFromCanvas, getChainConfig } from "@/lib/onchain"
import { SPINMINT_NFT_ADDRESS } from "@/utils/constants"

interface MintModalProps {
  isOpen: boolean
  onClose: () => void
  canvasElement: HTMLCanvasElement | null
  profileImageUrl: string
  userAddress: string
  chainId: number
  onSuccess: (tokenId: bigint, hash: string) => void
}

type MintState = "idle" | "signing" | "mining" | "success" | "error"

export default function MintModal({
  isOpen,
  onClose,
  canvasElement,
  profileImageUrl,
  userAddress,
  chainId,
  onSuccess,
}: MintModalProps) {
  const [mintState, setMintState] = useState<MintState>("idle")
  const [error, setError] = useState<string>("")
  const [txHash, setTxHash] = useState<string>("")
  const [tokenId, setTokenId] = useState<bigint>(BigInt(0))
  const [progress, setProgress] = useState(0)

  const chainConfig = getChainConfig(chainId)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setMintState("idle")
      setError("")
      setTxHash("")
      setTokenId(BigInt(0))
      setProgress(0)
    }
  }, [isOpen])

  // Update progress based on mint state
  useEffect(() => {
    switch (mintState) {
      case "idle":
        setProgress(0)
        break
      case "signing":
        setProgress(25)
        break
      case "mining":
        setProgress(75)
        break
      case "success":
        setProgress(100)
        break
      case "error":
        setProgress(0)
        break
    }
  }, [mintState])

  const handleMint = async () => {
    if (!canvasElement) {
      setError("Canvas not ready. Please try again.")
      return
    }

    try {
      setMintState("signing")
      setError("")

      const result = await mintFromCanvas(userAddress, canvasElement, profileImageUrl, chainId)

      setTxHash(result.hash)
      setTokenId(result.tokenId)
      setMintState("mining")

      // Simulate mining progress (in real app, you'd track actual confirmation)
      setTimeout(() => {
        setMintState("success")
        onSuccess(result.tokenId, result.hash)
      }, 2000)
    } catch (err: any) {
      console.error("Minting failed:", err)
      setMintState("error")

      if (err.message.includes("User rejected")) {
        setError("Transaction was cancelled.")
      } else if (err.message.includes("insufficient funds")) {
        setError("Insufficient funds for gas fees.")
      } else {
        setError(err.message || "Minting failed. Please try again.")
      }
    }
  }

  const getStateMessage = () => {
    switch (mintState) {
      case "idle":
        return "Ready to mint your SpinMint NFT"
      case "signing":
        return "Please sign the transaction in your wallet..."
      case "mining":
        return "Minting your NFT on Base..."
      case "success":
        return "Successfully minted your SpinMint NFT!"
      case "error":
        return "Minting failed"
      default:
        return ""
    }
  }

  const getExplorerUrl = (hash: string) => {
    return `${chainConfig.blockExplorer}/tx/${hash}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 modal-backdrop"
            onClick={mintState === "idle" || mintState === "error" ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md card z-10"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold gradient-text">Mint SpinMint NFT</h2>
              {(mintState === "idle" || mintState === "error") && (
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Progress Ring */}
              <div className="flex justify-center">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 progress-ring" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="45" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="3" fill="none" />
                    {/* Progress circle */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                      variants={progressRingVariants}
                      initial="hidden"
                      animate="visible"
                    />
                  </svg>

                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {mintState === "success" ? (
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : mintState === "error" ? (
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <div className="text-sm font-medium text-primary">{Math.round(progress)}%</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Message */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{getStateMessage()}</p>

                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3 border border-red-500/20">{error}</p>
                )}
              </div>

              {/* Transaction Details */}
              {mintState !== "idle" && !error && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network:</span>
                    <span>{chainConfig.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contract:</span>
                    <span className="font-mono text-xs">
                      {SPINMINT_NFT_ADDRESS.slice(0, 6)}...{SPINMINT_NFT_ADDRESS.slice(-4)}
                    </span>
                  </div>
                  {txHash && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction:</span>
                      <a
                        href={getExplorerUrl(txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-mono text-xs"
                      >
                        {txHash.slice(0, 6)}...{txHash.slice(-4)}
                      </a>
                    </div>
                  )}
                  {mintState === "success" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token ID:</span>
                      <span className="font-medium">#{tokenId.toString()}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {mintState === "idle" && (
                  <>
                    <button onClick={onClose} className="flex-1 btn-secondary">
                      Cancel
                    </button>
                    <button onClick={handleMint} className="flex-1 btn-primary">
                      Mint NFT
                    </button>
                  </>
                )}

                {mintState === "error" && (
                  <>
                    <button onClick={onClose} className="flex-1 btn-secondary">
                      Close
                    </button>
                    <button onClick={handleMint} className="flex-1 btn-primary">
                      Try Again
                    </button>
                  </>
                )}

                {mintState === "success" && (
                  <button onClick={onClose} className="w-full btn-primary">
                    Done
                  </button>
                )}
              </div>

              {/* Gas Fee Notice */}
              {mintState === "idle" && (
                <p className="text-xs text-muted-foreground text-center">
                  Gas fees will be paid in ETH on {chainConfig.name}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
