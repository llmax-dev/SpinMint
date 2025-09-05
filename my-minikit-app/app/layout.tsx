import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import "../css/globals.css"
import "../css/theme.css"

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "SpinMint - Spin your profile, mint your NFT",
  description: "Transform your Farcaster profile into a spinning vinyl record NFT on Base blockchain.",
  keywords: ["farcaster", "miniapp", "nft", "base", "blockchain", "vinyl", "record"],
  authors: [{ name: "SpinMint Team" }],
  creator: "SpinMint",
  publisher: "SpinMint",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "SpinMint - Spin your profile, mint your NFT",
    description: "Transform your Farcaster profile into a spinning vinyl record NFT on Base blockchain.",
    url: "/",
    siteName: "SpinMint",
    images: [
      {
        url: "/screenshot.png",
        width: 1200,
        height: 630,
        alt: "SpinMint - Spin your profile, mint your NFT",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpinMint - Spin your profile, mint your NFT",
    description: "Transform your Farcaster profile into a spinning vinyl record NFT on Base blockchain.",
    images: ["/screenshot.png"],
    creator: "@spinmint",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="color-scheme" content="dark" />

        {/* Farcaster Mini App specific meta tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="/screenshot.png" />
        <meta property="fc:frame:button:1" content="Open SpinMint" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta
          property="fc:frame:button:1:target"
          content={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
        />

        {/* Preload critical resources */}
        <link rel="preload" href="/icon.png" as="image" />
        <link rel="preconnect" href="https://sepolia.base.org" />
      </head>
      <body className="min-h-screen bg-gradient-primary text-foreground">
        <div className="relative min-h-screen">
          {/* Background gradient overlay */}
          <div className="fixed inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-blue-900/20 pointer-events-none" />

          {/* Main content */}
          <main className="relative z-10">{children}</main>

          {/* Global loading indicator */}
          <div
            id="global-loading"
            className="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="loading-spinner w-8 h-8" />
          </div>
        </div>
      </body>
    </html>
  )
}
