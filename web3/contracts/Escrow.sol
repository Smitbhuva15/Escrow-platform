// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";
import "../libs/events.sol";
import "../libs/Structures.sol";
import "../libs/errors.sol";
import {Dao} from "./Dao.sol";

contract Escrow is Dao {
    uint256 public totalStake = 0;
    uint256 public totalAllTimeDeposit = 0;
    uint256 public totalAllTimeStake = 0;

    constructor() {
        owner = msg.sender;
    }

    /////////////////////////   modifier   /////////////////////////////

    modifier onlyowner(address user) {
        if (user != owner) {
            revert onlyOwnerAccess();
        }
        _;
    }

    /////////////////////////  Owner Access functions   /////////////////////////////
    function setownerPercentage(
        uint256 newownerPercentage
    ) public onlyowner(msg.sender) {
        ownerPercentage = newownerPercentage;
    }

    function setminmumvotedweightPercentage(
        uint256 newpercentage
    ) public onlyowner(msg.sender) {
        minmumvotedweightPercentage = newpercentage;
    }

    function setvotingDay(uint256 newvotingday) public onlyowner(msg.sender) {
        newvotingday = newvotingday * 24 * 60 * 60;
        votingDays = newvotingday;
    }

    /////////////////////////  Deal functions   /////////////////////////////

    // give voting power
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

        emit Staked(msg.sender, msg.value);
    }

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

        emit Unstaked(msg.sender, amount);
    }

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
            revert deadlineExeceed();
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
            dealed.disputedId
        );
    }

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
            dealed.disputedId
        );
    }

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
            dealed.disputedId
        );
    }

    receive() external payable {
        revert NotAllowedDirectETHtransfer();
    }

    /////////////////////////  getter functions   /////////////////////////////

    function getDeal(uint256 dealId) public view returns (deal memory) {
        return deals[dealId];
    }

    function getDispute(
        uint256 disputeId
    ) public view returns (disputed memory) {
        return disputes[disputeId];
    }

    function getdeposited(address user) public view returns (uint256) {
        return deposited[user];
    }

    function gettotalDepositAsBuyer(
        address user
    ) public view returns (uint256) {
        return totalDepositAsBuyer[user];
    }

    function gettotalreciveAsSeller(
        address user
    ) public view returns (uint256) {
        return totalreciveAsSeller[user];
    }

    function getusedWeight(
        uint256 disputedId,
        address user
    ) public view returns (uint256) {
        return usedWeight[disputedId][user];
    }

    function gethasvoted(
        uint256 disputedId,
        address user
    ) public view returns (bool) {
        return hasvoted[disputedId][user];
    }

    function getcurrentlyLocked(address user) public view returns (uint256) {
        return currentlyLocked[user];
    }

    function getstaked(address user) public view returns (uint256) {
        return staked[user];
    }
}
