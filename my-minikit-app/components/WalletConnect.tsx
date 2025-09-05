"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { buttonVariants } from "@/lib/animations"
import { isFarcasterMiniApp } from "@/lib/farcaster"
import { getChainConfig, DEFAULT_CHAIN_ID } from "@/utils/constants"

interface WalletConnectProps {
  onConnect: (address: string, chainId: number) => void
  onDisconnect: () => void
  className?: string
}

export default function WalletConnect({ onConnect, onDisconnect, className = "" }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string>("")
  const [chainId, setChainId] = useState<number>(DEFAULT_CHAIN_ID)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string>("")

  // Check if wallet is already connected
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) return

      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" })

      if (accounts.length > 0) {
        const addr = accounts[0]
        const chain = Number.parseInt(currentChainId, 16)

        setAddress(addr)
        setChainId(chain)
        setIsConnected(true)
        onConnect(addr, chain)
      }
    } catch (err) {
      console.error("Failed to check wallet connection:", err)
    }
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    setError("")

    try {
      // Check if we're in Farcaster Mini App first
      if (isFarcasterMiniApp()) {
        // Try MiniKit connection first
        // @ts-ignore - MiniKit types not available
        if (window.farcaster && window.farcaster.wallet) {
          // @ts-ignore
          const result = await window.farcaster.wallet.connect()
          if (result.address) {
            setAddress(result.address)
            setChainId(result.chainId || DEFAULT_CHAIN_ID)
            setIsConnected(true)
            onConnect(result.address, result.chainId || DEFAULT_CHAIN_ID)
            return
          }
        }
      }

      // Fallback to standard wallet connection
      if (!window.ethereum) {
        throw new Error("No wallet found. Please install MetaMask or Coinbase Wallet.")
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length === 0) {
        throw new Error("No accounts found. Please unlock your wallet.")
      }

      // Get current chain
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" })
      const chain = Number.parseInt(currentChainId, 16)

      // Check if we're on the right network
      if (chain !== DEFAULT_CHAIN_ID && chain !== 8453) {
        await switchToBaseNetwork()
        return // switchToBaseNetwork will handle the connection
      }

      const addr = accounts[0]
      setAddress(addr)
      setChainId(chain)
      setIsConnected(true)
      onConnect(addr, chain)
    } catch (err: any) {
      console.error("Wallet connection failed:", err)
      setError(err.message || "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const switchToBaseNetwork = async () => {
    try {
      const targetChainId = DEFAULT_CHAIN_ID
      const chainConfig = getChainConfig(targetChainId)

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })

      // After switching, connect
      await connectWallet()
    } catch (switchError: any) {
      // If the chain hasn't been added to the wallet
      if (switchError.code === 4902) {
        try {
          const chainConfig = getChainConfig(DEFAULT_CHAIN_ID)

          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${DEFAULT_CHAIN_ID.toString(16)}`,
                chainName: chainConfig.name,
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: [chainConfig.rpcUrl],
                blockExplorerUrls: [chainConfig.blockExplorer],
              },
            ],
          })

          // After adding, try to switch again
          await switchToBaseNetwork()
        } catch (addError) {
          console.error("Failed to add network:", addError)
          setError("Failed to add Base network to wallet")
        }
      } else {
        console.error("Failed to switch network:", switchError)
        setError("Failed to switch to Base network")
      }
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress("")
    setChainId(DEFAULT_CHAIN_ID)
    setError("")
    onDisconnect()
  }

  // Listen for account and chain changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else if (accounts[0] !== address) {
        setAddress(accounts[0])
        onConnect(accounts[0], chainId)
      }
    }

    const handleChainChanged = (newChainId: string) => {
      const chain = Number.parseInt(newChainId, 16)
      setChainId(chain)
      if (isConnected) {
        onConnect(address, chain)
      }
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum?.removeListener("chainChanged", handleChainChanged)
    }
  }, [address, chainId, isConnected, onConnect])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getNetworkName = () => {
    return getChainConfig(chainId).name
  }

  const isWrongNetwork = () => {
    return chainId !== DEFAULT_CHAIN_ID && chainId !== 8453
  }

  if (isConnected) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{formatAddress(address)}</p>
            <p className="text-xs text-muted-foreground">{getNetworkName()}</p>
          </div>
          <button
            onClick={disconnectWallet}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Disconnect
          </button>
        </div>

        {isWrongNetwork() && (
          <motion.button
            onClick={switchToBaseNetwork}
            className="btn-primary text-sm py-2"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Switch to Base Network
          </motion.button>
        )}

        {error && <p className="text-xs text-red-400 bg-red-500/10 rounded p-2 border border-red-500/20">{error}</p>}
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <motion.button
        onClick={connectWallet}
        disabled={isConnecting}
        className="w-full btn-primary"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        {isConnecting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="loading-spinner w-4 h-4" />
            Connecting...
          </div>
        ) : (
          "Connect Wallet"
        )}
      </motion.button>

      {error && <p className="text-xs text-red-400 bg-red-500/10 rounded p-2 border border-red-500/20">{error}</p>}

      <p className="text-xs text-muted-foreground text-center">
        {isFarcasterMiniApp()
          ? "Connect with MiniKit or your preferred wallet"
          : "Connect with MetaMask, Coinbase Wallet, or other Web3 wallet"}
      </p>
    </div>
  )
}
