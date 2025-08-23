// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract Escrow {
    uint256 public dealCount = 0;
    uint256 public totalStake = 0;
    uint256 public totalAllTimeDeposit = 0;
    uint256 public totalAllTimeStake = 0;

    /////////////////////////   events   /////////////////////////////
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
        bool isDisputed
    );

    event Staked(address depositer, uint256 amount);

    event Unstaked(address withdrawer, uint256 amount);

    event Deposit(
        uint256 dealId,
        address buyer,
        address seller,
        uint256 amount,
        string status,
        string title,
        string description,
        bool isDisputed
    );

    event Delivered(
        uint256 dealId,
        address buyer,
        address seller,
        uint256 amount,
        string status,
        string title,
        string description,
        bool isDisputed
    );

    /////////////////////////   errors   /////////////////////////////

    error invalidAddress();
    error invalidAmount();
    error invalidDeadline();
    error inValidTransaction();
    error insufficientStakeamount();
    error inValidDealId();
    error deadlineExeceed();
    error dealNotCreated();
    error invalidBuyerAddress();
    error invalidSellerAddress();
    error dealNotFunded();

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
    }

    /////////////////////////   mapping   /////////////////////////////

    mapping(uint256 dealId => deal) public deals;
    mapping(address => uint256) public staked;
    mapping(address => uint256) public deposited;
    mapping(address => uint256) public totalDepositAsBuyer;
    mapping(address => uint256) public totalreciveAsSeller;

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
    ) public {
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
            false
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
            false
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
            dealed.isDisputed
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
            dealed.isDisputed
        );
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
}
