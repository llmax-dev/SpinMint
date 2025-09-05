export const CHAIN_CONFIG = {
  chainId: 84532, // Base Sepolia
  name: "Base Sepolia",
  rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
}

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""

// Only initialize blockchain features when not in preview mode
export const isPreviewMode = () => {
  return process.env.NEXT_PUBLIC_PREVIEW === "true" || typeof window === "undefined" || !window.__SPINMINT_ENABLE_CHAIN
}

export const initializeChain = () => {
  if (isPreviewMode()) {
    console.log("[v0] Blockchain disabled in preview mode")
    return null
  }

  // Initialize wagmi/OnchainKit here when needed
  return CHAIN_CONFIG
}
