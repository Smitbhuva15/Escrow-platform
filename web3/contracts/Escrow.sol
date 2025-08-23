// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";
import "../libs/events.sol";
import "../libs/Structures.sol";
import "../libs/errors.sol";

contract Escrow {
    uint256 public dealCount = 0;
    uint256 public disputeCount = 0;
    uint256 public totalStake = 0;
    uint256 public totalAllTimeDeposit = 0;
    uint256 public totalAllTimeStake = 0;
    uint256 public minmumvotedweightPercentage = 10;
    address public owner;
    uint256 public votingDays = 7 days;

    /////////////////////////   mapping   /////////////////////////////

    mapping(uint256 dealId => deal) public deals;
    mapping(address => uint256) public staked;
    mapping(address => uint256) public deposited;
    mapping(address => uint256) public totalDepositAsBuyer;
    mapping(address => uint256) public totalreciveAsSeller;

    mapping(uint256 disbutedId => disbuted) public disbutes;
    mapping(uint256 => mapping(address => uint256)) public usedWeight;
    mapping(uint256 => mapping(address => bool)) public hashvoted;
    mapping(address=>uint256)public currentlyLocked;

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
    function setvotingDay(uint256 newvotingday) public onlyowner(msg.sender) {
        newvotingday = newvotingday * 24 * 60 * 60;
        votingDays = newvotingday;
    }

    function setminmumvotedweightPercentage(
        uint256 newpercentage
    ) public onlyowner(msg.sender) {
        minmumvotedweightPercentage = newpercentage;
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
            revert dealNotCreated();
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

        if (
            dealed.status != dealstatus.Delivered &&
            dealed.status != dealstatus.Funded
        ) {
            revert dealNotDeliveredOrFunded();
        }

        (bool success, ) = payable(dealed.seller).call{value: dealed.amount}(
            ""
        );

        if (!success) {
            revert inValidTransaction();
        }

        deposited[msg.sender] -= dealed.amount;

        totalreciveAsSeller[dealed.seller] += dealed.amount;

        dealed.status = dealstatus.Resolved;
        dealed.amount = 0;

        emit Confirmation(
            dealed.dealId,
            dealed.buyer,
            dealed.seller,
            dealed.amount,
            "Resolved",
            dealed.title,
            dealed.description,
            dealed.isDisputed,
            dealed.disputedId
        );
    }

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
        uint256 disbutedId = disputeCount;
        uint256 quorumTarget = (dealed.amount * minmumvotedweightPercentage) /
            100;
        uint256 votingEndTime = block.timestamp + votingDays;

        dealed.disputedId = disputeCount;
        dealed.isDisputed=true;
        dealed.status=dealstatus.Disputed;

        if (quorumTarget == 0 || minmumvotedweightPercentage == 0) {
            revert invalidquorum();
        }

        disbutes[disbutedId] = disbuted(
            disbutedId,
            votingEndTime,
            0,
            0,
            quorumTarget,
            false,
            dealId
        );

        emit Dispute(
            disbutedId,
            votingEndTime,
            0,
            0,
            quorumTarget,
            false,
            dealId
        );
    }

    function vote(uint256 disbutedId,bool supportYes, uint256 weight) external {
        if (disbutedId > disputeCount || disbutedId <= 0) {
            revert inValidDisputedId();
        }

        disbuted storage dp = disbutes[disbutedId];
        deal storage dealed = deals[dp.dealId];
        

        if (
            msg.sender == dealed.buyer ||
            msg.sender != dealed.seller ||
            msg.sender == address(0)
        ) {
            revert invalidAddress();
        }

        if (dp.dealId == 0) {
            revert inValidDealId();
        }

        if (dp.closed == true) {
            revert disbuteIsClosed();
        }

        if (dp.votingEndTime < block.timestamp) {
            revert deadlineExeceed();
        }

        if(hashvoted[disbutedId][msg.sender]==true){
            revert AlReadyVoted();
        }

        if(weight<=0){
            revert ZeroWeight();
        }

        if(currentlyLocked[msg.sender]+weight>staked[msg.sender]){
            revert AlreadyUseAllStake();
        }

       currentlyLocked[msg.sender]+=weight;

       hashvoted[disbutedId][msg.sender]=true;
       usedWeight[disbutedId][msg.sender]+=weight;

      if(supportYes==true){
        // support seller
        dp.YesVoting+=weight;
      }
      else{
        //support buyer
        dp.Novoting+=weight;
      }
 
     emit Voted(dp.disbutedId,dp.dealId,msg.sender,weight,supportYes);

    }

    /////////////////////////  getter functions   /////////////////////////////

    function getDeal(uint256 dealId) public view returns (deal memory) {
        return deals[dealId];
    }

    function getdeposited(address buyer) public view returns (uint256) {
        return deposited[buyer];
    }

    function gettotalDepositAsBuyer(
        address buyer
    ) public view returns (uint256) {
        return totalDepositAsBuyer[buyer];
    }

    function gettotalreciveAsSeller(
        address buyer
    ) public view returns (uint256) {
        return totalreciveAsSeller[buyer];
    }
}
