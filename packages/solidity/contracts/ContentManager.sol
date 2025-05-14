// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/access/Ownable.sol";

// Prompt:
//
// Flesh out this contract to do the following:
// It should be ownable.
// It should keep track of content ids and whether or not a use has paid.
// Content always costs $1.
// When a user pays for the content, it should be sent to the contract owner, and it should mark that the sender paid fo that piece of content.

contract ContentManager is Ownable {
    // Fixed price of $1 in wei (assuming this is about 0.0005 ETH)
    uint256 public constant CONTENT_PRICE = 0.0005 ether;
    
    // Mapping to track if a user has paid for a specific content
    mapping(address => mapping(uint256 => bool)) public hasPaid;
    
    // Event emitted when a user purchases content
    event ContentPurchased(address indexed user, uint256 indexed contentId);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Allows a user to pay for content
     * @param contentId The ID of the content being purchased
     */
    function payForContent(uint256 contentId) external payable {
        require(msg.value == CONTENT_PRICE, "Must pay exactly 1 dollar worth of ETH");
        require(!hasPaid[msg.sender][contentId], "Already paid for this content");
        
        // Mark that the user has paid for this content
        hasPaid[msg.sender][contentId] = true;
        
        // Send payment to the owner
        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "Transfer to owner failed");
        
        emit ContentPurchased(msg.sender, contentId);
    }
    
    /**
     * @dev Checks if a user has access to a specific content
     * @param user Address of the user
     * @param contentId ID of the content
     * @return Whether the user has access
     */
    function hasAccessToContent(address user, uint256 contentId) external view returns (bool) {
        return hasPaid[user][contentId];
    }
}
