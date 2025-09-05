"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import CDSpinner from "@/components/CDSpinner"
import WalletConnect from "@/components/WalletConnect"
import { getCurrentFarcasterProfile, type FarcasterProfile } from "@/lib/farcaster"
import { containerVariants, textVariants, buttonVariants } from "@/lib/animations"
import { DEFAULT_CHAIN_ID } from "@/utils/constants"
import Link from "next/link"

export default function HomePage() {
  const [profile, setProfile] = useState<FarcasterProfile | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string>("")
  const [chainId, setChainId] = useState<number>(DEFAULT_CHAIN_ID)
  const [isLoading, setIsLoading] = useState(true)

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
    <motion.div className="min-h-screen flex flex-col" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <motion.div variants={textVariants}>
          <h1 className="text-2xl font-bold gradient-text">SpinMint</h1>
          <p className="text-sm text-muted-foreground">Spin your profile, mint your NFT</p>
        </motion.div>

        <motion.div variants={textVariants} className="w-64">
          <WalletConnect onConnect={handleWalletConnect} onDisconnect={handleWalletDisconnect} />
        </motion.div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <motion.div className="text-center space-y-8 max-w-2xl mx-auto" variants={containerVariants}>
          {/* Hero Text */}
          <motion.div variants={textVariants} className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="gradient-text">Spin your profile,</span>
              <br />
              <span className="text-white">mint your NFT</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
              Transform your Farcaster profile image into a spinning vinyl record and mint it as an NFT on Base
              blockchain.
            </p>
          </motion.div>

          {/* Spinning Record */}
          <motion.div variants={textVariants} className="flex justify-center py-8">
            {profile ? (
              <CDSpinner profileImageUrl={profile.pfpUrl} size={280} isSpinning={true} className="animate-float" />
            ) : (
              <div className="w-[280px] h-[280px] rounded-full bg-secondary/50 border border-border flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="loading-spinner w-8 h-8 mx-auto" />
                  <p className="text-sm text-muted-foreground">Loading profile...</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Profile Info */}
          {profile && (
            <motion.div variants={textVariants} className="card max-w-md mx-auto">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-secondary flex items-center justify-center text-white font-bold">
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">{profile.displayName}</h3>
                  <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  <p className="text-xs text-muted-foreground">FID: {profile.fid}</p>
                </div>
              </div>
              {profile.bio && (
                <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">{profile.bio}</p>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div variants={textVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/mint">
              <motion.button
                className="btn-primary px-8 py-4 text-lg font-semibold min-w-[200px]"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                disabled={!isConnected || !profile}
              >
                {!isConnected ? "Connect Wallet to Mint" : "Mint Your Record"}
              </motion.button>
            </Link>

            <Link href="/send">
              <motion.button
                className="btn-secondary px-8 py-4 text-lg font-semibold min-w-[200px]"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                disabled={!isConnected}
              >
                Send NFTs
              </motion.button>
            </Link>
          </motion.div>

          {/* Connection Status */}
          {!isConnected && (
            <motion.p variants={textVariants} className="text-sm text-muted-foreground">
              Connect your wallet to start minting your SpinMint NFT
            </motion.p>
          )}

          {/* Features */}
          <motion.div variants={textVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Your Profile</h3>
              <p className="text-sm text-muted-foreground">Uses your actual Farcaster profile image</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold">Base Blockchain</h3>
              <p className="text-sm text-muted-foreground">Minted as ERC-721 NFTs on Base</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Mini App</h3>
              <p className="text-sm text-muted-foreground">Native Farcaster Mini App experience</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>Built for the BASE Hackathon • Powered by Base blockchain</p>
      </footer>
    </motion.div>
  )
}
