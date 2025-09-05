"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import CDSpinner from "@/components/CDSpinner"
import MintModal from "@/components/MintModal"
import WalletConnect from "@/components/WalletConnect"
import ConfettiOrPlane from "@/components/ConfettiOrPlane"
import { getCurrentFarcasterProfile, type FarcasterProfile } from "@/lib/farcaster"
import { containerVariants, textVariants, buttonVariants, pageVariants } from "@/lib/animations"
import { DEFAULT_CHAIN_ID, getChainConfig } from "@/utils/constants"
import Link from "next/link"

export default function MintPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [profile, setProfile] = useState<FarcasterProfile | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string>("")
  const [chainId, setChainId] = useState<number>(DEFAULT_CHAIN_ID)
  const [isLoading, setIsLoading] = useState(true)
  const [showMintModal, setShowMintModal] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [mintedTokenId, setMintedTokenId] = useState<bigint>(BigInt(0))
  const [mintedTxHash, setMintedTxHash] = useState<string>("")

  // Load Farcaster profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userProfile = await getCurrentFarcasterProfile()
        setProfile(userProfile)
      } catch (error) {
        console.error("Failed to load profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleWalletConnect = (address: string, chain: number) => {
    setUserAddress(address)
    setChainId(chain)
    setIsConnected(true)
  }

  const handleWalletDisconnect = () => {
    setUserAddress("")
    setChainId(DEFAULT_CHAIN_ID)
    setIsConnected(false)
  }

  const handleCanvasReady = (canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas
  }

  const handleMintClick = () => {
    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }

    if (!canvasRef.current) {
      alert("Canvas not ready. Please wait a moment and try again.")
      return
    }

    setShowMintModal(true)
  }

  const handleMintSuccess = (tokenId: bigint, hash: string) => {
    setMintedTokenId(tokenId)
    setMintedTxHash(hash)
    setShowMintModal(false)
    setShowCelebration(true)
  }

  const handleCelebrationComplete = () => {
    setShowCelebration(false)
  }

  const getExplorerUrl = (hash: string) => {
    const chainConfig = getChainConfig(chainId)
    return `${chainConfig.blockExplorer}/tx/${hash}`
  }

  const isWrongNetwork = () => {
    return chainId !== DEFAULT_CHAIN_ID && chainId !== 8453
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="loading-spinner w-12 h-12 mx-auto" />
          <p className="text-muted-foreground">Loading SpinMint...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
    >
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-border">
        <div className="flex items-center gap-4">
          <Link href="/">
            <motion.button
              className="p-2 hover:bg-secondary/50 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          </Link>
          <div>
            <h1 className="text-xl font-bold gradient-text">Mint Your Record</h1>
            <p className="text-sm text-muted-foreground">Create your SpinMint NFT</p>
          </div>
        </div>

        <div className="w-64">
          <WalletConnect onConnect={handleWalletConnect} onDisconnect={handleWalletDisconnect} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          className="text-center space-y-8 max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Spinning Record Preview */}
          <motion.div variants={textVariants} className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Your <span className="gradient-text">SpinMint NFT</span>
            </h2>
            <p className="text-muted-foreground">This is how your profile will look as a spinning vinyl record NFT</p>
          </motion.div>

          <motion.div variants={textVariants} className="flex justify-center py-8">
            {profile ? (
              <CDSpinner
                profileImageUrl={profile.pfpUrl}
                size={320}
                isSpinning={true}
                onCanvasReady={handleCanvasReady}
                className="shadow-glow-lg"
              />
            ) : (
              <div className="w-[320px] h-[320px] rounded-full bg-secondary/50 border border-border flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="loading-spinner w-8 h-8 mx-auto" />
                  <p className="text-sm text-muted-foreground">Loading profile...</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Profile Info Card */}
          {profile && (
            <motion.div variants={textVariants} className="card max-w-md mx-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-secondary flex items-center justify-center text-white font-bold">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold">{profile.displayName}</h3>
                    <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border text-sm">
                  <div>
                    <p className="text-muted-foreground">Network</p>
                    <p className="font-medium">{getChainConfig(chainId).name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Standard</p>
                    <p className="font-medium">ERC-721</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Mint Button */}
          <motion.div variants={textVariants} className="space-y-4">
            {isWrongNetwork() ? (
              <div className="card bg-yellow-500/10 border-yellow-500/20">
                <p className="text-yellow-400 text-sm">
                  Please switch to {getChainConfig(DEFAULT_CHAIN_ID).name} to mint your NFT
                </p>
              </div>
            ) : !isConnected ? (
              <div className="card bg-blue-500/10 border-blue-500/20">
                <p className="text-blue-400 text-sm">Connect your wallet to mint your SpinMint NFT</p>
              </div>
            ) : (
              <motion.button
                onClick={handleMintClick}
                className="btn-primary px-12 py-4 text-lg font-semibold min-w-[250px]"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                disabled={!profile || !canvasRef.current}
              >
                {!profile ? "Loading Profile..." : "Mint NFT Now"}
              </motion.button>
            )}
          </motion.div>

          {/* Success Message */}
          {mintedTxHash && (
            <motion.div variants={textVariants} className="card bg-green-500/10 border-green-500/20 space-y-3">
              <div className="flex items-center gap-2 text-green-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold">Successfully Minted!</span>
              </div>
              <div className="text-sm space-y-2">
                <p>
                  Token ID: <span className="font-mono">#{mintedTokenId.toString()}</span>
                </p>
                <a
                  href={getExplorerUrl(mintedTxHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  View on Explorer
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </motion.div>
          )}

          {/* Additional Actions */}
          <motion.div variants={textVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/send">
              <motion.button
                className="btn-secondary px-6 py-3"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                disabled={!isConnected}
              >
                Send NFTs
              </motion.button>
            </Link>

            <Link href="/">
              <motion.button
                className="btn-secondary px-6 py-3"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Back to Home
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Mint Modal */}
      <MintModal
        isOpen={showMintModal}
        onClose={() => setShowMintModal(false)}
        canvasElement={canvasRef.current}
        profileImageUrl={profile?.pfpUrl || ""}
        userAddress={userAddress}
        chainId={chainId}
        onSuccess={handleMintSuccess}
      />

      {/* Celebration Animation */}
      <ConfettiOrPlane type="confetti" isVisible={showCelebration} onComplete={handleCelebrationComplete} />
    </motion.div>
  )
}
