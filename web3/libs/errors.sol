// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/////////////////////////    Errors    /////////////////////////////

/// @notice Provided address is zero or otherwise invalid.
error invalidAddress();

/// @notice Supplied ETH or token amount is zero or below the required minimum.
error invalidAmount();

/// @notice Deal deadline is missing, already passed, or otherwise invalid.
error invalidDeadline();

/// @notice Transaction could not be processed due to an internal failure.
error inValidTransaction();

/// @notice Staked amount is less than the minimum required.
error insufficientStakeamount();

/// @notice dealId does not exist.
error inValidDealId();

/// @notice Action attempted after the deal’s deadline has passed.
error deadlineExeceed();

/// @notice All stake is currently locked in an active voting process.
error AllstakeLockInVoting();

/// @notice Buyer address provided is invalid or zero.
error invalidBuyerAddress();

/// @notice Seller address provided is invalid or zero.
error invalidSellerAddress();

/// @notice Buyer tried to confirm delivery but the deal has no funds deposited.
error dealNotFunded();

/// @notice Buyer tried to confirm receipt before the seller marked delivery.
error dealNotDelivered();

/// @notice Required funding or delivery is missing for this action.
error dealNotDeliveredOrFunded();

/// @notice Caller is not the contract owner.
error onlyOwnerAccess();

/// @notice Neither buyer nor seller address matches the expected party.
error invalidBuyerOrSellerAddress();

/// @notice Dispute already exists for this deal.
error Alreadydisputed();

/// @notice Provided quorum value is zero or otherwise invalid.
error invalidquorum();

/// @notice disputeId does not exist.
error inValidDisputedId();

/// @notice Dispute is closed and cannot accept further actions.
error disputeIsClosed();

/// @notice Voter has already voted on this dispute.
error AlReadyVoted();

/// @notice Voter’s calculated voting weight is zero.
error ZeroWeight();

/// @notice User has already committed their entire stake to voting.
error AlreadyUseAllStake();

/// @notice Action requires dispute deadline to have passed, but it has not.
error deadlinenotExceed();

/// @notice Action requires the deal to be in dispute, but it is not.
error dealIsNotDispute();

/// @notice Caller did not contribute stake to this dispute.
error NotContibuteTheDispute();

/// @notice Dispute is not yet closed; action cannot proceed.
error diputeIsNotClosed();

/// @notice ETH sent directly to the contract without using the deposit function.
error NotAllowedDirectETHtransfer();

/// @notice Seller and buyer addresses are identical, which is not allowed.
error SellerAndBuyerBothSameNotAllowed();

/// @notice Funds are already deposited for this deal.
error dealAlReadyDeposited();

/// @notice Seller has not marked the deal as delivered.
error dealIsNotDelivered();

/// @notice Deal is not funded and cannot proceed.
error dealIsNoFunded();

/// @notice Buyer attempted to open dispute on an already confirmed deal.
error dealIsAlReadyConfirm();

/// @notice Funding deadline has passed; deposit is no longer allowed.
error depositDeadlineExeceed();
