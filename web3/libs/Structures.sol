// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


/////////////////////////   enum   /////////////////////////////

enum dealstatus {
    none,
    Created,
    Funded,
    Delivered,
    Confirmation,
    Disputed,
    Resolved
}

/////////////////////////   struct   /////////////////////////////

/**
 * @notice Represents a single escrow deal between a buyer and a seller.
 * @param dealId        Unique identifier for the deal.
 * @param buyer         Address of the buyer who funds the deal.
 * @param seller        Address of the seller who provides the product or service.
 * @param amount        Total amount of ETH (in wei) locked in escrow for this deal.
 * @param title         Short title describing the deal.
 * @param description   Detailed description of the goods or services involved.
 * @param status        Current lifecycle status of the deal (see {dealstatus} enum).
 * @param createdAt     UNIX timestamp when the deal was created.
 * @param deadline      UNIX timestamp by which the buyer must deposit funds.
 * @param isDisputed    Flag indicating whether a dispute has been opened for this deal.
 * @param disputedId    ID of the related dispute if `isDisputed` is true.
 */
struct deal {
    uint256 dealId;
    address buyer;
    address seller;
    uint256 amount;
    string title;
    string description;
    dealstatus status;
    uint256 createdAt;
    uint256 deadline;
    bool isDisputed;
    uint256 disputedId;
}

/**
 * @notice Represents a dispute opened for a specific deal.
 * @param disputedId    Unique identifier for the dispute.
 * @param votingEndTime UNIX timestamp marking when voting on this dispute ends.
 * @param YesVoting     Total voting weight in favor of the seller.
 * @param Novoting      Total voting weight in favor of the buyer.
 * @param quorumTarget  Minimum combined voting weight required for the result to be valid.
 * @param closed        True if the dispute has been resolved and voting is closed.
 * @param dealId        ID of the associated deal in contention.
 */
struct disputed {
    uint256 disputedId;
    uint256 votingEndTime;
    uint256 YesVoting;
    uint256 Novoting;
    uint256 quorumTarget;
    bool closed;
    uint256 dealId;
}
