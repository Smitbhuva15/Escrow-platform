// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";
import "../libs/events.sol";
import "../libs/Structures.sol";
import "../libs/errors.sol";

contract Dao {
    uint256 public dealCount = 0;
    uint256 public disputeCount = 0;
    uint256 public votingDays = 7 days;
    uint256 public minmumvotedweightPercentage = 10;
    uint256 public ownerPercentage=1;
    address public owner;


    /////////////////////////   mapping   /////////////////////////////

    mapping(uint256 dealId => deal) public deals;
    mapping(address => uint256) public staked;
    mapping(address => uint256) public deposited;
    mapping(address => uint256) public totalDepositAsBuyer;
    mapping(address => uint256) public totalreciveAsSeller;

    mapping(uint256 disputedId => disputed) public disputes;
    mapping(uint256 => mapping(address => uint256)) public usedWeight;
    mapping(uint256 => mapping(address => bool)) public hasvoted;
    mapping(address => uint256) public currentlyLocked;

    /////////////////////////  DAO functions   /////////////////////////////

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

        if (
            dealed.status != dealstatus.Delivered &&
            dealed.status != dealstatus.Funded
        ) {
            revert dealNotDeliveredOrFunded();
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
            dealId
        );
    }

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

        hasvoted[disputedId][msg.sender] = supportYes;
        usedWeight[disputedId][msg.sender] += weight;

        if (supportYes == true) {
            // support seller
            dp.YesVoting += weight;
        } else {
            //support buyer
            dp.Novoting += weight;
        }

        emit Voted(dp.disputedId, dp.dealId, msg.sender, weight, supportYes);
    }

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
            "Resolved"
        );
    }

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
    }
}
