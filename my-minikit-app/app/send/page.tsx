"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import WalletConnect from "@/components/WalletConnect"
import { sendToken, checkTokenOwnership, getChainConfig } from "@/lib/onchain"
import { containerVariants, textVariants, buttonVariants, pageVariants } from "@/lib/animations"
import { DEFAULT_CHAIN_ID } from "@/utils/constants"
import Link from "next/link"

export default function SendPage() {
  const router = useRouter()

  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string>("")
  const [chainId, setChainId] = useState<number>(DEFAULT_CHAIN_ID)

  const [recipientAddress, setRecipientAddress] = useState<string>("")
  const [tokenId, setTokenId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [txHash, setTxHash] = useState<string>("")

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

  const validateInputs = () => {
    if (!recipientAddress.trim()) {
      setError("Please enter a recipient address")
      return false
    }

    if (!tokenId.trim()) {
      setError("Please enter a token ID")
      return false
    }

    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      setError("Please enter a valid Ethereum address")
      return false
    }

    // Validate token ID is a number
    if (!/^\d+$/.test(tokenId)) {
      setError("Token ID must be a number")
      return false
    }

    // Check if sending to self
    if (recipientAddress.toLowerCase() === userAddress.toLowerCase()) {
      setError("Cannot send to your own address")
      return false
    }

    return true
  }

  const handleSend = async () => {
    if (!validateInputs()) return

    setIsLoading(true)
    setError("")
    setSuccess("")
    setTxHash("")

    try {
      const tokenIdBigInt = BigInt(tokenId)

      // Check ownership first
      const isOwner = await checkTokenOwnership(userAddress, tokenIdBigInt, chainId)
      if (!isOwner) {
        throw new Error("You do not own this NFT")
      }

      // Send the token
      const hash = await sendToken(recipientAddress, tokenIdBigInt, chainId)

      setTxHash(hash)
      setSuccess(`Successfully sent NFT #${tokenId} to ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`)

      // Clear form
      setRecipientAddress("")
      setTokenId("")
    } catch (err: any) {
      console.error("Transfer failed:", err)

      if (err.message.includes("User rejected")) {
        setError("Transaction was cancelled.")
      } else if (err.message.includes("insufficient funds")) {
        setError("Insufficient funds for gas fees.")
      } else {
        setError(err.message || "Transfer failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getExplorerUrl = (hash: string) => {
    const chainConfig = getChainConfig(chainId)
    return `${chainConfig.blockExplorer}/tx/${hash}`
  }

  const isWrongNetwork = () => {
    return chainId !== DEFAULT_CHAIN_ID && chainId !== 8453
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
            <h1 className="text-xl font-bold gradient-text">Send NFTs</h1>
            <p className="text-sm text-muted-foreground">Transfer your SpinMint NFTs</p>
          </div>
        </div>

        <div className="w-64">
          <WalletConnect onConnect={handleWalletConnect} onDisconnect={handleWalletDisconnect} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          className="w-full max-w-md space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <motion.div variants={textVariants} className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Send SpinMint NFT</h2>
            <p className="text-muted-foreground">Transfer your NFT to another address</p>
          </motion.div>

          {/* Form */}
          <motion.div variants={textVariants} className="card space-y-6">
            {/* Network Warning */}
            {isWrongNetwork() && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  Please switch to {getChainConfig(DEFAULT_CHAIN_ID).name} to send NFTs
                </p>
              </div>
            )}

            {/* Connection Warning */}
            {!isConnected && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-400 text-sm">Connect your wallet to send NFTs</p>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="recipient" className="block text-sm font-medium mb-2">
                  Recipient Address
                </label>
                <input
                  id="recipient"
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  disabled={!isConnected || isLoading}
                />
              </div>

              <div>
                <label htmlFor="tokenId" className="block text-sm font-medium mb-2">
                  Token ID
                </label>
                <input
                  id="tokenId"
                  type="text"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  placeholder="Enter token ID (e.g., 1)"
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  disabled={!isConnected || isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-green-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold">Transfer Successful!</span>
                </div>
                <p className="text-green-400 text-sm">{success}</p>
                {txHash && (
                  <a
                    href={getExplorerUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                  >
                    View Transaction
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* Send Button */}
            <motion.button
              onClick={handleSend}
              disabled={!isConnected || isLoading || isWrongNetwork() || !recipientAddress.trim() || !tokenId.trim()}
              className="w-full btn-primary py-3"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="loading-spinner w-4 h-4" />
                  Sending...
                </div>
              ) : (
                "Send NFT"
              )}
            </motion.button>

            {/* Gas Fee Notice */}
            {isConnected && !isWrongNetwork() && (
              <p className="text-xs text-muted-foreground text-center">
                Gas fees will be paid in ETH on {getChainConfig(chainId).name}
              </p>
            )}
          </motion.div>

          {/* Additional Actions */}
          <motion.div variants={textVariants} className="flex flex-col sm:flex-row gap-4">
            <Link href="/mint" className="flex-1">
              <motion.button
                className="w-full btn-secondary py-3"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Mint New NFT
              </motion.button>
            </Link>

            <Link href="/" className="flex-1">
              <motion.button
                className="w-full btn-secondary py-3"
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
    </motion.div>
  )
}
