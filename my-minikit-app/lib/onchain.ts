import { createPublicClient, createWalletClient, custom, http } from "viem"
import { base, baseSepolia } from "viem/chains"
import { SPINMINT_NFT_ADDRESS, CHAIN_CONFIG, DEFAULT_CHAIN_ID } from "@/utils/constants"

// Contract ABI for SpinMintNFT
export const SPINMINT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "tokenURI", type: "string" },
    ],
    name: "safeMint",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentTokenId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

// Get chain configuration
export function getChainConfig(chainId: number = DEFAULT_CHAIN_ID) {
  return chainId === 8453 ? CHAIN_CONFIG.base : CHAIN_CONFIG.baseSepolia
}

// Get viem chain
export function getViemChain(chainId: number = DEFAULT_CHAIN_ID) {
  return chainId === 8453 ? base : baseSepolia
}

// Create public client for reading blockchain data
export function createPublicClientForChain(chainId: number = DEFAULT_CHAIN_ID) {
  const chain = getViemChain(chainId)
  const config = getChainConfig(chainId)

  return createPublicClient({
    chain,
    transport: http(config.rpcUrl),
  })
}

// Create wallet client for transactions
export function createWalletClientForChain(chainId: number = DEFAULT_CHAIN_ID) {
  const chain = getViemChain(chainId)

  if (typeof window === "undefined") {
    throw new Error("Wallet client can only be created in browser environment")
  }

  if (!window.ethereum) {
    throw new Error("No wallet found. Please install a Web3 wallet.")
  }

  return createWalletClient({
    chain,
    transport: custom(window.ethereum),
  })
}

// Generate metadata JSON for NFT
export function generateNFTMetadata(profileImageUrl: string, canvasDataUrl: string, userAddress: string): string {
  const metadata = {
    name: `SpinMint #${Date.now()}`,
    description: "A spinning vinyl record NFT created from a Farcaster profile image using SpinMint.",
    image: canvasDataUrl,
    attributes: [
      {
        trait_type: "Original Profile Image",
        value: profileImageUrl,
      },
      {
        trait_type: "Created By",
        value: userAddress,
      },
      {
        trait_type: "Creation Date",
        value: new Date().toISOString(),
      },
      {
        trait_type: "Platform",
        value: "SpinMint",
      },
    ],
    external_url: "https://spinmint.vercel.app",
    animation_url: canvasDataUrl,
  }

  // Convert to base64 data URL
  const jsonString = JSON.stringify(metadata)
  const base64 = btoa(jsonString)
  return `data:application/json;base64,${base64}`
}

// Mint NFT from canvas
export async function mintFromCanvas(
  toAddress: string,
  canvasElement: HTMLCanvasElement,
  profileImageUrl: string,
  chainId: number = DEFAULT_CHAIN_ID,
): Promise<{ hash: string; tokenId: bigint }> {
  try {
    const walletClient = createWalletClientForChain(chainId)
    const publicClient = createPublicClientForChain(chainId)

    // Get canvas data URL
    const canvasDataUrl = canvasElement.toDataURL("image/png", 0.9)

    // Generate metadata
    const tokenURI = generateNFTMetadata(profileImageUrl, canvasDataUrl, toAddress)

    // Get account
    const [account] = await walletClient.getAddresses()
    if (!account) {
      throw new Error("No account connected")
    }

    // Simulate transaction first
    const { request } = await publicClient.simulateContract({
      address: SPINMINT_NFT_ADDRESS,
      abi: SPINMINT_ABI,
      functionName: "safeMint",
      args: [toAddress as `0x${string}`, tokenURI],
      account,
    })

    // Execute transaction
    const hash = await walletClient.writeContract(request)

    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    // Get token ID from logs (assuming it's the first log)
    const tokenId = receipt.logs[0]?.topics[3] ? BigInt(receipt.logs[0].topics[3]) : BigInt(0)

    return { hash, tokenId }
  } catch (error) {
    console.error("Minting failed:", error)
    throw error
  }
}

// Send/transfer NFT
export async function sendToken(to: string, tokenId: bigint, chainId: number = DEFAULT_CHAIN_ID): Promise<string> {
  try {
    const walletClient = createWalletClientForChain(chainId)
    const publicClient = createPublicClientForChain(chainId)

    // Get account
    const [account] = await walletClient.getAddresses()
    if (!account) {
      throw new Error("No account connected")
    }

    // Verify ownership
    const owner = await publicClient.readContract({
      address: SPINMINT_NFT_ADDRESS,
      abi: SPINMINT_ABI,
      functionName: "ownerOf",
      args: [tokenId],
    })

    if (owner.toLowerCase() !== account.toLowerCase()) {
      throw new Error("You do not own this NFT")
    }

    // Simulate transaction
    const { request } = await publicClient.simulateContract({
      address: SPINMINT_NFT_ADDRESS,
      abi: SPINMINT_ABI,
      functionName: "safeTransferFrom",
      args: [account, to as `0x${string}`, tokenId],
      account,
    })

    // Execute transaction
    const hash = await walletClient.writeContract(request)

    // Wait for confirmation
    await publicClient.waitForTransactionReceipt({ hash })

    return hash
  } catch (error) {
    console.error("Transfer failed:", error)
    throw error
  }
}

// Get total supply
export async function getTotalSupply(chainId: number = DEFAULT_CHAIN_ID): Promise<bigint> {
  const publicClient = createPublicClientForChain(chainId)

  return await publicClient.readContract({
    address: SPINMINT_NFT_ADDRESS,
    abi: SPINMINT_ABI,
    functionName: "totalSupply",
  })
}

// Check if address owns a token
export async function checkTokenOwnership(
  address: string,
  tokenId: bigint,
  chainId: number = DEFAULT_CHAIN_ID,
): Promise<boolean> {
  try {
    const publicClient = createPublicClientForChain(chainId)

    const owner = await publicClient.readContract({
      address: SPINMINT_NFT_ADDRESS,
      abi: SPINMINT_ABI,
      functionName: "ownerOf",
      args: [tokenId],
    })

    return owner.toLowerCase() === address.toLowerCase()
  } catch {
    return false
  }
}
