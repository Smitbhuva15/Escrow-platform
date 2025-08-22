// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Escrow {
    uint256 public dealCount = 0;

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

    /////////////////////////   errors   /////////////////////////////

    error invalidAddress();
    error invalidAmount();
    error invalidDeadline();

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

    /////////////////////////  Deal functions   /////////////////////////////

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

        deadline=deadline*24*60*60+block.timestamp;

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


    /////////////////////////  getter functions   /////////////////////////////

    function getDeal(uint256 dealId) public view returns (deal memory) {
        return deals[dealId];
    }
    
}
