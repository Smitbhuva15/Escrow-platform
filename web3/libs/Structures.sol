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

struct disputed {
    uint256 disputedId;
    uint256 votingEndTime;
    uint256 YesVoting;
    uint256 Novoting;
    uint256 quorumTarget; // minimum total votes required
    bool closed;
    uint256 dealId;
}
