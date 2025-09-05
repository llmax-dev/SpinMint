import { type NextRequest, NextResponse } from "next/server"

// Optional API route for serving NFT metadata
// This is a fallback if you want to serve metadata from your own server
// instead of using data URLs

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tokenId = searchParams.get("tokenId")

  if (!tokenId) {
    return NextResponse.json({ error: "Token ID is required" }, { status: 400 })
  }

  // In a real implementation, you would fetch metadata from your database
  // For now, return a placeholder response
  const metadata = {
    name: `SpinMint #${tokenId}`,
    description: "A spinning vinyl record NFT created from a Farcaster profile image using SpinMint.",
    image: `/placeholder.svg?height=400&width=400&query=vinyl+record+nft+${tokenId}`,
    attributes: [
      {
        trait_type: "Token ID",
        value: tokenId,
      },
      {
        trait_type: "Platform",
        value: "SpinMint",
      },
      {
        trait_type: "Creation Date",
        value: new Date().toISOString(),
      },
    ],
    external_url: `${process.env.NEXT_PUBLIC_APP_URL}?token=${tokenId}`,
  }

  return NextResponse.json(metadata, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  })
}
