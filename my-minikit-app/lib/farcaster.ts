// Farcaster Mini App integration utilities

export interface FarcasterProfile {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
  bio?: string
}

// Check if running inside Farcaster Mini App
export function isFarcasterMiniApp(): boolean {
  if (typeof window === "undefined") return false

  // Check for Farcaster-specific user agent or window properties
  const userAgent = window.navigator.userAgent
  const isFarcasterWebview =
    userAgent.includes("Farcaster") ||
    userAgent.includes("Warpcast") ||
    // @ts-ignore - Farcaster injects this
    window.farcaster !== undefined

  return isFarcasterWebview
}

// Get current user profile from Farcaster Mini App context
export async function getCurrentFarcasterProfile(): Promise<FarcasterProfile | null> {
  if (!isFarcasterMiniApp()) {
    console.log("Not running in Farcaster Mini App, returning mock profile")
    return getMockProfile()
  }

  try {
    // Try to get profile from Farcaster Mini App SDK
    // @ts-ignore - Farcaster SDK types not available
    if (window.farcaster && window.farcaster.getCurrentUser) {
      // @ts-ignore
      const user = await window.farcaster.getCurrentUser()
      return {
        fid: user.fid,
        username: user.username,
        displayName: user.displayName,
        pfpUrl: user.pfpUrl,
        bio: user.bio,
      }
    }

    // Fallback: try to extract from URL parameters or other methods
    const urlParams = new URLSearchParams(window.location.search)
    const fid = urlParams.get("fid")

    if (fid) {
      // If we have an FID, we could fetch profile data from Neynar API
      // For now, return a constructed profile
      return {
        fid: Number.parseInt(fid),
        username: `user${fid}`,
        displayName: `User ${fid}`,
        pfpUrl: `https://i.imgur.com/placeholder-${fid}.png`,
      }
    }

    return getMockProfile()
  } catch (error) {
    console.error("Failed to get Farcaster profile:", error)
    return getMockProfile()
  }
}

// Mock profile for development/testing
function getMockProfile(): FarcasterProfile {
  return {
    fid: 12345,
    username: "spinmint_user",
    displayName: "SpinMint User",
    pfpUrl: "/colorful-abstract-profile-avatar.jpg",
    bio: "Testing SpinMint - Spin your profile, mint your NFT!",
  }
}

// Fetch profile image with CORS handling
export async function fetchProfileImage(imageUrl: string): Promise<string> {
  try {
    // For development, if it's a placeholder URL, return it directly
    if (imageUrl.includes("/placeholder.svg")) {
      return imageUrl
    }

    // Try to fetch the image and convert to data URL for CORS safety
    const response = await fetch(imageUrl, {
      mode: "cors",
      headers: {
        Accept: "image/*",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }

    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error("Failed to fetch profile image:", error)
    // Return fallback placeholder
    return "/colorful-abstract-profile-avatar.jpg"
  }
}

// Share NFT back to Farcaster (if in Mini App context)
export async function shareToFarcaster(tokenId: bigint, contractAddress: string, chainId: number): Promise<boolean> {
  if (!isFarcasterMiniApp()) {
    console.log("Not in Farcaster Mini App, cannot share directly")
    return false
  }

  try {
    const shareText = `Just minted my profile as an NFT with SpinMint! 🎵\n\nToken #${tokenId}\nContract: ${contractAddress}`

    // @ts-ignore - Farcaster SDK
    if (window.farcaster && window.farcaster.share) {
      // @ts-ignore
      await window.farcaster.share({
        text: shareText,
        url: `${window.location.origin}?token=${tokenId}`,
      })
      return true
    }

    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(shareText)
    return true
  } catch (error) {
    console.error("Failed to share to Farcaster:", error)
    return false
  }
}

// Get Farcaster Mini App manifest URL
export function getFarcasterManifestUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  return `${baseUrl}/manifest.json`
}

// Validate Farcaster username format
export function isValidFarcasterUsername(username: string): boolean {
  // Farcaster usernames are alphanumeric with optional hyphens/underscores
  const usernameRegex = /^[a-zA-Z0-9_-]+$/
  return usernameRegex.test(username) && username.length >= 1 && username.length <= 16
}
