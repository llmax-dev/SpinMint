# SpinMint Mini App

Transform your Farcaster profile into a spinning vinyl record NFT on Base blockchain.

## 🚀 Quick Start

### Development
\`\`\`bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
\`\`\`

### Environment Setup
\`\`\`bash
# Copy environment template
cp .env.example .env.local

# Update variables:
# NEXT_PUBLIC_CHAIN_ID=84532 (Base Sepolia)
# NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
# NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Production Build
\`\`\`bash
# Build for production
pnpm build

# Start production server
pnpm start
\`\`\`

## 🏗️ Architecture

### Components
- **CDSpinner**: Vinyl record rendering with profile image
- **MintModal**: NFT minting flow with progress tracking
- **WalletConnect**: MiniKit + fallback wallet connection
- **ConfettiOrPlane**: Success celebration animations

### Pages
- **Home** (`/`): Landing page with spinning record
- **Mint** (`/mint`): NFT minting interface
- **Send** (`/send`): NFT transfer functionality

### Libraries
- **Framer Motion**: Smooth 60fps animations
- **OnchainKit/wagmi**: Base blockchain integration
- **Tailwind CSS**: Styling and responsive design

## 🎨 Design System

### Colors
- Primary: Purple/Violet gradients (#8b5cf6, #a855f7)
- Background: Dark blue gradients (#1e1b4b, #312e81)
- Accents: Blue highlights (#3b82f6)

### Typography
- Headings: Geist Sans (bold, gradient text)
- Body: Geist Sans (regular, high contrast)
- Code: Geist Mono

### Animations
- Vinyl spinning: 22s rotation with CSS transforms
- Hover effects: Scale 1.03, soft shadows
- Press effects: Scale 0.98, ripple animation

## 🔗 Farcaster Integration

### Mini App Features
- Profile image fetching from Farcaster context
- MiniKit wallet connection (with fallback)
- Native webview optimization

### Usage in Farcaster
1. Deploy to Vercel
2. Share URL in Warpcast
3. Opens as native Mini App experience

## 🛠️ Development

### File Structure
\`\`\`
app/
├── layout.tsx          # Root layout with fonts
├── page.tsx           # Home page
├── mint/page.tsx      # Minting interface
└── send/page.tsx      # Transfer interface

components/
├── CDSpinner.tsx      # Vinyl record component
├── MintModal.tsx      # Minting modal
├── WalletConnect.tsx  # Wallet connection
└── ConfettiOrPlane.tsx # Success animations

lib/
├── onchain.ts         # Blockchain interactions
├── farcaster.ts       # Mini App integration
└── animations.ts      # Motion presets
\`\`\`

### Key Features
- Mobile-first responsive design
- 60fps animations with GPU optimization
- Accessibility support (reduced motion, focus rings)
- Error handling and loading states
- Network switching and validation

## 🚢 Deployment

### Vercel Deployment
\`\`\`bash
# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_CHAIN_ID=84532
# NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
# NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
\`\`\`

### Contract Integration
The app automatically reads the deployed contract address from `utils/constants.ts`, which is updated by the contract deployment script.

## 📱 Mini App Manifest

Located at `/public/manifest.json`:
- Defines app metadata for Farcaster
- Specifies required permissions
- Sets app icon and screenshots

## 🎯 Performance

### Optimizations
- Canvas rendering with requestAnimationFrame
- Image preloading and CORS handling
- Lazy loading and code splitting
- Reduced motion support for accessibility

### Lighthouse Targets
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## 🔧 Troubleshooting

### Common Issues
1. **Wallet not connecting**: Check network settings and wallet installation
2. **Profile not loading**: Verify Farcaster context or use fallback
3. **Canvas not rendering**: Check image CORS and loading states
4. **Transaction failing**: Verify network, gas, and contract address

### Debug Mode
Use browser dev tools to check:
- Console logs for errors
- Network tab for failed requests
- Application tab for localStorage/sessionStorage

## 📄 License

MIT License - see LICENSE file for details.
