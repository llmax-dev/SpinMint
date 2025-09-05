// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SpinMintNFT
 * @dev ERC721 contract for SpinMint - Spin your profile, mint your NFT
 */
contract SpinMintNFT is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;

    event TokenMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event TokenTransferred(address indexed from, address indexed to, uint256 indexed tokenId);

    constructor() ERC721("SpinMint NFT", "SPIN") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev Safely mint a new token with metadata
     * @param to Address to mint the token to
     * @param tokenURI Metadata URI for the token
     * @return tokenId The ID of the newly minted token
     */
    function safeMint(address to, string memory tokenURI) 
        public 
        onlyRole(MINTER_ROLE) 
        returns (uint256) 
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit TokenMinted(to, tokenId, tokenURI);
        return tokenId;
    }

    /**
     * @dev Get the current token counter value
     * @return Current number of tokens minted
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Get total supply of tokens
     * @return Total number of tokens minted
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Grant minter role to an address
     * @param minter Address to grant minter role to
     */
    function grantMinterRole(address minter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, minter);
    }

    /**
     * @dev Revoke minter role from an address
     * @param minter Address to revoke minter role from
     */
    function revokeMinterRole(address minter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(MINTER_ROLE, minter);
    }

    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Override transfer to emit custom event
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        if (from != address(0) && to != address(0)) {
            emit TokenTransferred(from, to, tokenId);
        }
    }
}
