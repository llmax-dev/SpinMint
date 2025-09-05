// Network configuration for SpinMint
export const CHAIN_CONFIG = {
  baseSepolia: {
    id: 84532,
    name: "Base Sepolia",
    rpcUrl: "https://sepolia.base.org",
    blockExplorer: "https://sepolia.basescan.org",
    faucet: "https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet",
  },
  base: {
    id: 8453,
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    blockExplorer: "https://basescan.org",
    faucet: null,
  },
} as const

// Default to Base Sepolia for development
export const DEFAULT_CHAIN_ID = 84532 // Base Sepolia
export const CHAIN_ID = 84532
export const RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org"

// Contract address will be injected by deployment script
export const SPINMINT_NFT_ADDRESS = "0x0000000000000000000000000000000000000000" as const
