# SpinMint 🎵

**Spin your profile, mint your NFT.**

SpinMint is a Farcaster Mini App that transforms your profile image into a spinning vinyl record/CD hybrid and lets you mint it as an NFT on Base blockchain.

## 🏆 BASE Hackathon Submission

- **Live Demo**: https://spinmint.vercel.app
- **GitHub Repository**: https://github.com/your-username/spinmint
- **Base Usage**: ERC-721 contract deployed on Base Sepolia with full mint/transfer functionality
- **Bonus**: Farcaster Mini App integration

## ✨ Features

- 🎨 Transform Farcaster profile images into spinning vinyl records
- 🔗 Mint as ERC-721 NFTs on Base Sepolia (testnet) 
- 📱 Native Farcaster Mini App experience
- 🎉 Celebration animations and smooth 60fps interactions
- 💸 Send NFTs to other addresses
- 🌐 Works in browser and Farcaster webview

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Base Sepolia testnet ETH ([Get from faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet))

### Local Development

1. **Clone and install**
\`\`\`bash
git clone https://github.com/your-username/spinmint
cd spinmint
pnpm install
\`\`\`

2. **Deploy contract to Base Sepolia**
\`\`\`bash
# Copy contract environment
cp contract/.env.example contract/.env
# Add your PRIVATE_KEY and BASE_SEPOLIA_RPC_URL to contract/.env

# Deploy contract (writes address to frontend automatically)
pnpm --filter contract run deploy:sepolia
\`\`\`

3. **Start frontend**
\`\`\`bash
# Copy app environment  
cp my-minikit-app/.env.example my-minikit-app/.env.local
# Update NEXT_PUBLIC_APP_URL if needed

# Start development server
pnpm dev
\`\`\`

4. **Open http://localhost:3000**

### Vercel Deployment

1. **Deploy to Vercel**
\`\`\`bash
cd my-minikit-app
vercel
\`\`\`

2. **Set environment variables in Vercel dashboard**
- `NEXT_PUBLIC_CHAIN_ID=84532`
- `NEXT_PUBLIC_RPC_URL=https://sepolia.base.org`
- `NEXT_PUBLIC_APP_URL=https://your-app.vercel.app`
- `NEXT_PUBLIC_MINIAPP=true`

### Farcaster Mini App Setup

1. Add your deployed URL to Farcaster Mini App registry
2. Share the Mini App in Warpcast: `https://your-app.vercel.app`
3. Users can open directly in Farcaster for full Mini App experience

## 🏗️ Architecture

\`\`\`
/
├── contract/           # Hardhat project for ERC-721 NFT
├── my-minikit-app/     # Next.js App Router Mini App  
└── docs/              # Screenshots and documentation
\`\`\`

### Smart Contract
- **SpinMintNFT.sol**: ERC-721 contract with minting functionality
- **Base Sepolia**: Default testnet deployment
- **Metadata**: Stored as data URLs (no external dependencies)

### Frontend Stack
- **Next.js 14** (App Router)
- **Tailwind CSS** + **Framer Motion** for animations
- **OnchainKit** for Base integration
- **MiniKit** for Farcaster Mini App features

## 🎯 What's Implemented

✅ **Core Features**
- Spinning vinyl record with profile image texture
- ERC-721 NFT minting on Base Sepolia
- NFT transfer functionality
- Farcaster Mini App integration
- Celebration animations

✅ **Technical**
- Complete monorepo with contract + frontend
- Automated contract deployment with address injection
- Mobile-first responsive design
- 60fps animations with GPU optimization
- Accessibility and reduced motion support

✅ **UX Polish**
- Loading states and error handling
- Network switching prompts
- Gas estimation and transaction tracking
- Success celebrations with confetti

## 🔮 What's Next

- IPFS metadata storage option
- Batch minting functionality  
- Social sharing features
- Marketplace integration
- Mainnet deployment toggle

## 🛠️ Development

### Project Structure
\`\`\`
my-minikit-app/
├── app/                # Next.js App Router pages
├── components/         # React components
├── lib/               # Utilities and integrations
├── utils/             # Constants and helpers
└── public/            # Static assets
\`\`\`

### Key Components
- `CDSpinner.tsx`: Vinyl record rendering and animation
- `MintModal.tsx`: NFT minting flow with progress tracking
- `WalletConnect.tsx`: MiniKit + fallback wallet connection

### Scripts
\`\`\`bash
# Contract deployment
pnpm --filter contract run deploy:sepolia

# Frontend development
pnpm --filter my-minikit-app dev
pnpm --filter my-minikit-app build
pnpm --filter my-minikit-app start
\`\`\`

## 📝 License

MIT License - see LICENSE file for details.

---

Built for the BASE Hackathon 🏆
