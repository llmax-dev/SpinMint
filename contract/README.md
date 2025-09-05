# SpinMint Smart Contract

ERC-721 NFT contract for SpinMint - deployed on Base Sepolia.

## Features

- **ERC-721 Standard**: Full NFT functionality with metadata support
- **Access Control**: Role-based minting with MINTER_ROLE
- **URI Storage**: On-chain metadata storage support
- **Events**: Custom events for minting and transfers

## Deployment

### Base Sepolia (Testnet)
\`\`\`bash
# Set up environment
cp .env.example .env
# Add your PRIVATE_KEY and BASE_SEPOLIA_RPC_URL

# Deploy contract
pnpm run deploy:sepolia
\`\`\`

### Verification
After deployment, verify on BaseScan:
\`\`\`bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
\`\`\`

## Contract Interface

### Main Functions
- `safeMint(address to, string memory tokenURI)`: Mint new NFT
- `getCurrentTokenId()`: Get current token counter
- `totalSupply()`: Get total minted tokens
- `grantMinterRole(address minter)`: Grant minting permissions

### Events
- `TokenMinted(address indexed to, uint256 indexed tokenId, string tokenURI)`
- `TokenTransferred(address indexed from, address indexed to, uint256 indexed tokenId)`

## Security

- Uses OpenZeppelin contracts for security
- Role-based access control for minting
- Standard ERC-721 implementation with extensions
