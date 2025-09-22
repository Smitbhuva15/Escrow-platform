// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";
import "../libs/events.sol";
import "../libs/Structures.sol";
import "../libs/errors.sol";

/**
 * @title Dao
 * @author Smit Bhuva
 * @notice Handles disputes, voting, and stake management for deals on the platform.
 * @dev Manages voting power, quorum, dispute resolution, and unlocking of staked ETH.
 */

contract Dao {
    /////////////////////////  State Variables /////////////////////////

    /// @notice Total number of deals created.
    uint256 public dealCount = 0;

    /// @notice Total number of disputes created.
    uint256 public disputeCount = 0;

    /// @notice Default number of voting days for disputes (in days).
    uint256 public votingDays = 7 days;

    /// @notice Minimum voting weight percentage required for dispute resolution.
    uint256 public minmumvotedweightPercentage = 10;

    /// @notice Percentage of the deal amount taken by the owner.
    uint256 public ownerPercentage = 1;

    /// @notice Address of the contract owner.
    address public owner;

    /////////////////////////  Mappings /////////////////////////

    /// @notice Maps dealId to deal struct.
    mapping(uint256 dealId => deal) public deals;

    /// @notice Maps address to total staked ETH.
    mapping(address => uint256) public staked;

    /// @notice Maps address to deposited ETH as a buyer.
    mapping(address => uint256) public deposited;

    /// @notice Maps address to all-time deposited ETH as a buyer.
    mapping(address => uint256) public totalDepositAsBuyer;

    /// @notice Maps address to all-time received ETH as a seller.
    mapping(address => uint256) public totalreciveAsSeller;

    /// @notice Maps disputeId to disputed struct.
    mapping(uint256 disputedId => disputed) public disputes;

    /// @notice Maps disputeId and voter address to used voting weight.
    mapping(uint256 => mapping(address => uint256)) public usedWeight;

    /// @notice Maps disputeId and voter address to whether they have voted.
    mapping(uint256 => mapping(address => bool)) public hasvoted;

    /// @notice Maps address to currently locked stake during voting.
    mapping(address => uint256) public currentlyLocked;

    /////////////////////////  DAO Functions /////////////////////////

    /**
     * @notice Opens a dispute for a given deal.
     * @param dealId ID of the deal to dispute.
     * @dev Emits {Dispute} event. Reverts if the deal is invalid, already confirmed, or already disputed.
     */

    function openDispute(uint256 dealId) external {
        if (dealId > dealCount || dealId <= 0) {
            revert inValidDealId();
        }

        deal storage dealed = deals[dealId];

        if (msg.sender == address(0)) {
            revert invalidAddress();
        }

        if (msg.sender != dealed.buyer && msg.sender != dealed.seller) {
            revert invalidBuyerOrSellerAddress();
        }
        if (dealed.status == dealstatus.Confirmation) {
            revert dealIsAlReadyConfirm();
        }

        if (msg.sender == dealed.seller) {
            if (dealed.status == dealstatus.Funded) {
                revert dealIsNotDelivered();
            }

            if (dealed.status != dealstatus.Delivered) {
                revert dealIsNoFunded();
            }
        } else {
            if (
                dealed.status != dealstatus.Delivered &&
                dealed.status != dealstatus.Funded
            ) {
                revert dealNotDeliveredOrFunded();
            }
        }

        if (dealed.disputedId != 0) {
            revert Alreadydisputed();
        }

        disputeCount++;
        uint256 disputedId = disputeCount;
        uint256 quorumTarget = (dealed.amount * minmumvotedweightPercentage) /
            100;
        uint256 votingEndTime = block.timestamp + votingDays;

        dealed.disputedId = disputeCount;
        dealed.isDisputed = true;
        dealed.status = dealstatus.Disputed;

        if (quorumTarget == 0 || minmumvotedweightPercentage == 0) {
            revert invalidquorum();
        }

        disputes[disputedId] = disputed(
            disputedId,
            votingEndTime,
            0,
            0,
            quorumTarget,
            false,
            dealId
        );

        emit Dispute(
            disputedId,
            votingEndTime,
            0,
            0,
            quorumTarget,
            false,
            dealId,
            block.timestamp
        );
    }

    /**
     * @notice Vote on a dispute using staked ETH.
     * @param disputedId ID of the dispute to vote on.
     * @param supportYes True to support seller, false to support buyer.
     * @param weight Amount of staked ETH to use for voting.
     * @dev Updates usedWeight and currentlyLocked. Emits {Voted}. Reverts if voting rules are violated.
     */

    function vote(
        uint256 disputedId,
        bool supportYes,
        uint256 weight
    ) external {
        if (disputedId > disputeCount || disputedId <= 0) {
            revert inValidDisputedId();
        }

        disputed storage dp = disputes[disputedId];

        if (dp.dealId == 0) {
            revert inValidDealId();
        }

        deal storage dealed = deals[dp.dealId];

        if (
            msg.sender == dealed.buyer ||
            msg.sender == dealed.seller ||
            msg.sender == address(0)
        ) {
            revert invalidAddress();
        }

        if (dp.closed == true) {
            revert disputeIsClosed();
        }

        if (dp.votingEndTime < block.timestamp) {
            revert deadlineExeceed();
        }

        if (hasvoted[disputedId][msg.sender] == true) {
            revert AlReadyVoted();
        }

        if (weight <= 0) {
            revert ZeroWeight();
        }

        if (currentlyLocked[msg.sender] + weight > staked[msg.sender]) {
            revert AlreadyUseAllStake();
        }

        currentlyLocked[msg.sender] += weight;

        hasvoted[disputedId][msg.sender] = true;
        usedWeight[disputedId][msg.sender] += weight;

        if (supportYes == true) {
            // support seller
            dp.YesVoting += weight;
        } else {
            //support buyer
            dp.Novoting += weight;
        }

        emit Voted(
            dp.disputedId,
            dp.dealId,
            msg.sender,
            weight,
            supportYes,
            block.timestamp
        );
    }

    /**
     * @notice Closes a dispute after the voting period ends and distributes funds.
     * @param disputedId ID of the dispute to close.
     * @dev Emits {DisputeClosed}. Reverts if dispute is not closed, deadline not exceeded, or deal is not in dispute state.
     */

    function closeDispute(uint256 disputedId) external {
        if (disputedId > disputeCount || disputedId <= 0) {
            revert inValidDisputedId();
        }

        disputed storage dp = disputes[disputedId];

        if (dp.dealId == 0) {
            revert inValidDealId();
        }

        deal storage dealed = deals[dp.dealId];

        if (msg.sender == address(0)) {
            revert invalidAddress();
        }

        if (msg.sender != dealed.buyer && msg.sender != dealed.seller) {
            revert invalidBuyerOrSellerAddress();
        }

        if (dp.votingEndTime > block.timestamp) {
            revert deadlinenotExceed();
        }

        if (dp.closed == true) {
            revert disputeIsClosed();
        }

        if (dealed.status != dealstatus.Disputed) {
            revert dealIsNotDispute();
        }

        uint256 totalVotes = dp.YesVoting + dp.Novoting;
        // 1-->means buyer win
        // 2-->means seller win
        uint256 winner;
        if (totalVotes > dp.quorumTarget) {
            if (dp.YesVoting > dp.Novoting) {
                winner = 2; //seller win
            } else {
                winner = 1; // buyer win
            }
        } else {
            winner = 1; // buyer win
        }
        address winnerAddress;
        if (winner == 1) {
            winnerAddress = dealed.buyer;
        } else {
            winnerAddress = dealed.seller;
        }

        uint256 amount = dealed.amount;
        uint256 ownerTakeAmount = (amount * ownerPercentage) / 100;
        uint256 otherTransferamount = amount - ownerTakeAmount;

        bool success;

        (success, ) = payable(owner).call{value: ownerTakeAmount}("");

        if (!success) {
            revert inValidTransaction();
        }

        (success, ) = payable(winnerAddress).call{value: otherTransferamount}(
            ""
        );

        if (!success) {
            revert inValidTransaction();
        }

        if (winner == 2) {
            totalreciveAsSeller[dealed.seller] += otherTransferamount;
        }

        deposited[dealed.buyer] -= dealed.amount;

        dealed.amount = 0;
        dealed.isDisputed = false;
        dealed.status = dealstatus.Resolved;
        dp.closed = true;

        emit DisputeClosed(
            dp.disputedId,
            dp.dealId,
            dp.YesVoting,
            dp.Novoting,
            winner,
            winnerAddress,
            dp.quorumTarget,
            "Resolved",
            block.timestamp
        );
    }

    /**
     * @notice Unlocks staked ETH used in a resolved dispute.
     * @param disputedId ID of the resolved dispute.
     * @dev Emits {UnlockStake}. Reverts if dispute is not closed or the user did not participate.
     */

    function unlockstakefromdispute(uint256 disputedId) external {
        if (disputedId > disputeCount || disputedId <= 0) {
            revert inValidDisputedId();
        }

        disputed storage dp = disputes[disputedId];

        if (dp.dealId == 0) {
            revert inValidDealId();
        }

        if (dp.closed != true) {
            revert diputeIsNotClosed();
        }

        if (usedWeight[disputedId][msg.sender] == 0) {
            revert NotContibuteTheDispute();
        }

        currentlyLocked[msg.sender] -= usedWeight[disputedId][msg.sender];
        usedWeight[disputedId][msg.sender] = 0;
        emit UnlockStake(disputedId, dp.dealId, "true", block.timestamp);
    }
}
