// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";
import "../libs/events.sol";
import "../libs/Structures.sol";
import "../libs/errors.sol";
import {Dao} from "./Dao.sol";

/**
 * @title Escrow
 * @author Smit Bhuva
 * @notice Handles deal creation, fund deposits, delivery confirmation, dispute management, and staking for DAO-based voting.
 * @dev Extends Dao for voting functionality and integrates events for tracking actions like stake, unstake, deal creation, and dispute resolution.
 */

contract Escrow is Dao {
    /////////////////////////  State Variables /////////////////////////

    /// @notice Total ETH currently staked by all users for voting.
    uint256 public totalStake = 0;

    /// @notice Cumulative ETH deposited by buyers (all-time).
    uint256 public totalAllTimeDeposit = 0;

    /// @notice Cumulative ETH staked by all users (historical).
    uint256 public totalAllTimeStake = 0;

    /////////////////////////  Constructor /////////////////////////

    /**
     * @notice Sets the contract deployer as the owner.
     */
    constructor() {
        owner = msg.sender;
    }

    /////////////////////////  Modifiers /////////////////////////

    /**
     * @notice Ensures only the contract owner can call a function.
     * @param user Address attempting to call the function.
     * @dev Reverts with `onlyOwnerAccess()` if the user is not the owner.
     */
    modifier onlyowner(address user) {
        if (user != owner) {
            revert onlyOwnerAccess();
        }
        _;
    }

    /////////////////////////  Owner-Only Functions /////////////////////////

    /**
     * @notice Sets the percentage of deal amount reserved for the owner.
     * @param newownerPercentage Percentage value to set (0-100).
     * @dev Only callable by the owner.
     */

    function setownerPercentage(
        uint256 newownerPercentage
    ) public onlyowner(msg.sender) {
        ownerPercentage = newownerPercentage;
    }

    /**
     * @notice Sets the minimum voting weight percentage required for disputes.
     * @param newpercentage Minimum voting weight percentage (0-100).
     * @dev Only callable by the owner.
     */
    function setminmumvotedweightPercentage(
        uint256 newpercentage
    ) public onlyowner(msg.sender) {
        minmumvotedweightPercentage = newpercentage;
    }

    /**
     * @notice Sets the number of voting days for disputes.
     * @param newvotingday Voting duration in days.
     * @dev Converts days to seconds. Only callable by the owner.
     */
    function setvotingDay(uint256 newvotingday) public onlyowner(msg.sender) {
        newvotingday = newvotingday * 24 * 60 * 60;
        votingDays = newvotingday;
    }

    /////////////////////////  Staking Functions /////////////////////////

    /**
     * @notice Stake ETH to gain voting power.
     * @dev Updates totalStake, totalAllTimeStake, and the caller's staked balance. Emits {Staked}.
     *      Reverts if msg.value is 0 or caller is zero address.
     */
    function stake() external payable {
        if (msg.value <= 0) {
            revert invalidAmount();
        }

        if (msg.sender == address(0)) {
            revert invalidAddress();
        }

        totalAllTimeStake += msg.value;
        totalStake += msg.value;
        staked[msg.sender] += msg.value;

        emit Staked(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @notice Unstake previously staked ETH.
     * @param amount Amount of ETH to unstake.
     * @dev Checks if user has enough available stake and that none is locked in voting. Emits {Unstaked}.
     */
    function unstake(uint256 amount) external {
        if (amount <= 0) {
            revert invalidAmount();
        }

        if (staked[msg.sender] < amount) {
            revert insufficientStakeamount();
        }

        if (currentlyLocked[msg.sender] + amount > staked[msg.sender]) {
            revert AllstakeLockInVoting();
        }

        if (msg.sender == address(0)) {
            revert invalidAddress();
        }

        (bool success, ) = payable(msg.sender).call{value: amount}("");

        if (!success) {
            revert inValidTransaction();
        }

        totalStake -= amount;
        staked[msg.sender] -= amount;

        emit Unstaked(msg.sender, amount, block.timestamp);
    }

    /////////////////////////  Deal Functions /////////////////////////

    /**
     * @notice Creates a new deal between a buyer and a seller.
     * @param seller Address of the seller.
     * @param title Title of the deal.
     * @param description Description of the deal.
     * @param amount Deal amount in ETH.
     * @param deadline Deadline in days from now.
     * @dev Emits {Deal}. Reverts if addresses are invalid, seller equals buyer, amount <= 0, or deadline <= 0.
     */

    function dealCreation(
        address seller,
        string memory title,
        string memory description,
        uint256 amount,
        uint256 deadline
    ) external {
        if (seller == address(0) || msg.sender == address(0)) {
            revert invalidAddress();
        }
        if (seller == msg.sender) {
            revert SellerAndBuyerBothSameNotAllowed();
        }

        if (amount <= 0) {
            revert invalidAmount();
        }

        if (deadline <= 0) {
            revert invalidDeadline();
        }

        dealCount++;

        deadline = deadline * 24 * 60 * 60 + block.timestamp;

        deals[dealCount] = deal(
            dealCount,
            msg.sender,
            seller,
            amount,
            title,
            description,
            dealstatus.Created,
            block.timestamp,
            deadline,
            false,
            0
        );

        emit Deal(
            dealCount,
            msg.sender,
            seller,
            amount,
            title,
            description,
            "Created",
            block.timestamp,
            deadline,
            false,
            0
        );
    }

    /**
     * @notice Buyer deposits funds for a specific deal.
     * @param dealId ID of the deal.
     * @dev Emits {Deposit}. Reverts if dealId is invalid, sender is not buyer, amount mismatch, or deadline exceeded.
     */

    function deposit(uint256 dealId) external payable {
        if (dealId > dealCount || dealId <= 0) {
            revert inValidDealId();
        }

        deal storage dealed = deals[dealId];

        if (msg.sender == address(0)) {
            revert invalidAddress();
        }

        if (msg.sender != dealed.buyer) {
            revert invalidBuyerAddress();
        }

        if (msg.value <= 0 || dealed.amount != msg.value) {
            revert invalidAmount();
        }
        if (dealed.deadline < block.timestamp) {
            revert depositDeadlineExeceed();
        }

        if (dealed.status != dealstatus.Created) {
            revert dealAlReadyDeposited();
        }

        deposited[msg.sender] += msg.value;

        totalDepositAsBuyer[msg.sender] += msg.value;

        totalAllTimeDeposit += msg.value;

        dealed.status = dealstatus.Funded;

        emit Deposit(
            dealed.dealId,
            dealed.buyer,
            dealed.seller,
            dealed.amount,
            "Funded",
            dealed.title,
            dealed.description,
            dealed.isDisputed,
            dealed.disputedId,
            block.timestamp
        );
    }

    /**
     * @notice Marks a deal as delivered by the seller.
     * @param dealId ID of the deal.
     * @dev Emits {Delivered}. Reverts if dealId is invalid or sender is not seller.
     */
    function markDelivered(uint256 dealId) external {
        if (dealId > dealCount || dealId <= 0) {
            revert inValidDealId();
        }

        deal storage dealed = deals[dealId];

        if (msg.sender == address(0)) {
            revert invalidAddress();
        }

        if (msg.sender != dealed.seller) {
            revert invalidSellerAddress();
        }

        if (dealed.status != dealstatus.Funded) {
            revert dealNotFunded();
        }

        dealed.status = dealstatus.Delivered;

        emit Delivered(
            dealed.dealId,
            dealed.buyer,
            dealed.seller,
            dealed.amount,
            "Delivered",
            dealed.title,
            dealed.description,
            dealed.isDisputed,
            dealed.disputedId,
            block.timestamp
        );
    }

    /**
     * @notice Confirms receipt of a deal and releases funds.
     * @param dealId ID of the deal.
     * @dev Transfers ETH to seller and owner. Emits {Confirmation}. Reverts if deal not funded or delivered.
     */
    function confirmReceived(uint256 dealId) external {
        if (dealId > dealCount || dealId <= 0) {
            revert inValidDealId();
        }

        deal storage dealed = deals[dealId];

        if (msg.sender == address(0)) {
            revert invalidAddress();
        }

        if (msg.sender != dealed.buyer) {
            revert invalidBuyerAddress();
        }

        if (dealed.status == dealstatus.Funded) {
            revert dealIsNotDelivered();
        }

        if (dealed.status != dealstatus.Delivered) {
            revert dealIsNoFunded();
        }

        uint256 amount = dealed.amount;
        uint256 ownerTakeAmount = (amount * ownerPercentage) / 100;
        uint256 otherTransferamount = amount - ownerTakeAmount;

        bool success;

        (success, ) = payable(owner).call{value: ownerTakeAmount}("");

        if (!success) {
            revert inValidTransaction();
        }

        (success, ) = payable(dealed.seller).call{value: otherTransferamount}(
            ""
        );

        if (!success) {
            revert inValidTransaction();
        }

        deposited[msg.sender] -= dealed.amount;

        totalreciveAsSeller[dealed.seller] += otherTransferamount;

        dealed.status = dealstatus.Confirmation;
        dealed.amount = 0;

        emit Confirmation(
            dealed.dealId,
            dealed.buyer,
            dealed.seller,
            dealed.amount,
            "Confirmation",
            dealed.title,
            dealed.description,
            dealed.isDisputed,
            dealed.disputedId,
            block.timestamp
        );
    }


 /**
     * @notice Prevents direct ETH transfers to contract.
     * @dev Reverts any plain ETH transfers.
     */
    receive() external payable {
        revert NotAllowedDirectETHtransfer();
    }

    /////////////////////////  Getter Functions /////////////////////////

    /**
     * @notice Returns deal struct by ID.
     */
    function getDeal(uint256 dealId) public view returns (deal memory) {
        return deals[dealId];
    }

    /**
     * @notice Returns dispute struct by ID.
     */
    function getDispute(uint256 disputeId) public view returns (disputed memory) {
        return disputes[disputeId];
    }

    /**
     * @notice Returns the amount deposited by a user.
     */
    function getdeposited(address user) public view returns (uint256) {
        return deposited[user];
    }

    /**
     * @notice Returns total deposits made by a buyer.
     */
    function gettotalDepositAsBuyer(address user) public view returns (uint256) {
        return totalDepositAsBuyer[user];
    }

    /**
     * @notice Returns total amount received by a seller.
     */
    function gettotalreciveAsSeller(address user) public view returns (uint256) {
        return totalreciveAsSeller[user];
    }

    /**
     * @notice Returns how much stake has been used by a voter in a dispute.
     */
    function getusedWeight(uint256 disputedId, address user) public view returns (uint256) {
        return usedWeight[disputedId][user];
    }

    /**
     * @notice Checks if a user has already voted in a dispute.
     */
    function gethasvoted(uint256 disputedId, address user) public view returns (bool) {
        return hasvoted[disputedId][user];
    }

    /**
     * @notice Returns the currently locked stake of a user.
     */
    function getcurrentlyLocked(address user) public view returns (uint256) {
        return currentlyLocked[user];
    }

    /**
     * @notice Returns total staked ETH of a user.
     */
    function getstaked(address user) public view returns (uint256) {
        return staked[user];
    }
}
