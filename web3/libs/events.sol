// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/////////////////////////   Events   /////////////////////////////

/**
 * @notice Emitted when a new deal is created or an existing one is updated.
 * @param dealId     Unique identifier of the deal.
 * @param buyer      Address of the buyer funding the deal.
 * @param seller     Address of the seller providing goods or services.
 * @param amount     Total amount of ETH (in wei) locked for the deal.
 * @param title      Short title describing the deal.
 * @param description Detailed description of the deal terms.
 * @param status     Current lifecycle status of the deal.
 * @param createdAt  UNIX timestamp when the deal was emitted.
 * @param deadline   UNIX timestamp when the deal must be completed or confirmed.
 * @param isDisputed True if a dispute has been raised.
 * @param disputedId ID of the related dispute if one exists.
 */
event Deal(
    uint256 dealId,
    address buyer,
    address seller,
    uint256 amount,
    string title,
    string description,
    string status,
    uint256 createdAt,
    uint256 deadline,
    bool isDisputed,
    uint256 disputedId
);

/**
 * @notice Emitted when a participant stakes ETH to gain voting power.
 * @param depositer  Address of the user staking funds.
 * @param amount     Amount of ETH staked (in wei).
 * @param createdAt  UNIX timestamp when staking occurred.
 */
event Staked(address depositer, uint256 amount, uint256 createdAt);

/**
 * @notice Emitted when a participant withdraws their staked ETH.
 * @param withdrawer Address of the user who withdrew.
 * @param amount     Amount of ETH withdrawn (in wei).
 * @param createdAt  UNIX timestamp when the unstake occurred.
 */
event Unstaked(address withdrawer, uint256 amount, uint256 createdAt);

/**
 * @notice Emitted when the buyer deposits funds into a deal.
 * @param dealId       ID of the funded deal.
 * @param buyer        Address of the buyer making the deposit.
 * @param seller       Address of the seller.
 * @param amount       Amount of ETH deposited (in wei).
 * @param status       Deal status after deposit.
 * @param title        Title of the deal.
 * @param description  Description of the deal.
 * @param isDisputed   True if a dispute exists at the time of deposit.
 * @param disputedId   ID of the related dispute if any.
 * @param createdAt    UNIX timestamp of the deposit action.
 */
event Deposit(
    uint256 dealId,
    address buyer,
    address seller,
    uint256 amount,
    string status,
    string title,
    string description,
    bool isDisputed,
    uint256 disputedId,
    uint256 createdAt
);

/**
 * @notice Emitted when the seller marks a deal as delivered.
 * @param dealId      ID of the delivered deal.
 * @param buyer       Address of the buyer.
 * @param seller      Address of the seller.
 * @param amount      Amount of ETH held for the deal.
 * @param status      Deal status after delivery.
 * @param title       Title of the deal.
 * @param description Description of the deal.
 * @param isDisputed  True if a dispute exists.
 * @param disputedId  ID of the related dispute if any.
 * @param createdAt   UNIX timestamp of the delivery action.
 */
event Delivered(
    uint256 dealId,
    address buyer,
    address seller,
    uint256 amount,
    string status,
    string title,
    string description,
    bool isDisputed,
    uint256 disputedId,
    uint256 createdAt
);

/**
 * @notice Emitted when the buyer confirms receipt of goods/services.
 * @param dealId      ID of the confirmed deal.
 * @param buyer       Address of the buyer.
 * @param seller      Address of the seller.
 * @param amount      Amount of ETH released (in wei).
 * @param status      Deal status after confirmation.
 * @param title       Title of the deal.
 * @param description Description of the deal.
 * @param isDisputed  True if a dispute exists.
 * @param disputedId  ID of the related dispute if any.
 * @param createdAt   UNIX timestamp of the confirmation.
 */
event Confirmation(
    uint256 dealId,
    address buyer,
    address seller,
    uint256 amount,
    string status,
    string title,
    string description,
    bool isDisputed,
    uint256 disputedId,
    uint256 createdAt
);

/**
 * @notice Emitted when a dispute is opened for a deal.
 * @param disputedId    Unique ID of the dispute.
 * @param votingEndTime UNIX timestamp when the voting period ends.
 * @param YesVoting     Total voting weight supporting the seller.
 * @param Novoting      Total voting weight supporting the buyer.
 * @param quorumTarget  Minimum voting weight required for a valid result.
 * @param closed        True if the dispute has been resolved.
 * @param dealId        ID of the deal under dispute.
 * @param createdAt     UNIX timestamp when the dispute was created.
 */
event Dispute(
    uint256 disputedId,
    uint256 votingEndTime,
    uint256 amount,
    uint256 YesVoting,
    uint256 Novoting,
    uint256 quorumTarget,
    bool closed,
    uint256 dealId,
    uint256 createdAt
);

/**
 * @notice Emitted when a participant casts a vote in a dispute.
 * @param disputedId   ID of the dispute being voted on.
 * @param dealId       ID of the related deal.
 * @param voterAddress Address of the voter.
 * @param weight       Amount of staked ETH used as voting weight.
 * @param support      True if the vote supports the seller; false for the buyer.
 * @param createdAt    UNIX timestamp of the vote.
 */
event Voted(
    uint256 disputedId,
    uint256 dealId,
    address voterAddress,
    uint256 weight,
    bool support,
    uint256 createdAt
);

/**
 * @notice Emitted when a dispute is closed and a winner is declared.
 * @param disputedId    ID of the dispute.
 * @param dealId        ID of the associated deal.
 * @param YesVoting     Total voting weight for the seller.
 * @param Novoting      Total voting weight for the buyer.
 * @param winner        Numeric code of the winner (e.g., 1 = seller, 0 = buyer).
 * @param winnerAddress Address of the party who won the dispute.
 * @param quorumTarget  Minimum voting weight required for a valid outcome.
 * @param status        Final deal status after resolution.
 * @param createdAt     UNIX timestamp when the dispute was closed.
 */
event DisputeClosed(
    uint256 disputedId,
    uint256 dealId,
    uint256 YesVoting,
    uint256 Novoting,
    uint256 winner,
    address winnerAddress,
    uint256 quorumTarget,
    string status,
    uint256 createdAt
);

/**
 * @notice Emitted when staked funds are unlocked after dispute resolution.
 * @param disputedId   ID of the related dispute.
 * @param dealId       ID of the associated deal.
 * @param unlockstatus Description of the unlock action.
 * @param createdAt    UNIX timestamp when the stake was released.
 */
event UnlockStake(
    uint256 disputedId,
    uint256 dealId,
    string unlockstatus,
    uint256 createdAt
);
