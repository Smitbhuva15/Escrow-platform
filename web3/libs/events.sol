// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

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
    bool isDisputed,
    uint256 disputedId
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
    bool isDisputed,
    uint256 disputedId
);

event Delivered(
    uint256 dealId,
    address buyer,
    address seller,
    uint256 amount,
    string status,
    string title,
    string description,
    bool isDisputed,
    uint256 disputedId
);

event Confirmation(
    uint256 dealId,
    address buyer,
    address seller,
    uint256 amount,
    string status,
    string title,
    string description,
    bool isDisputed,
    uint256 disputedId
);

event Dispute(
    uint256 disputedId,
    uint256 votingEndTime,
    uint256 YesVoting,
    uint256 Novoting,
    uint256 quorumTarget,
    bool closed,
    uint256 dealId
);

event Voted(
    uint256 disputedId,
    uint256 dealId,
    address voterAddress,
    uint256 weight,
    bool support
);

event DisputeClosed(
    uint256 disputedId,
    uint256 dealId,
    uint256 YesVoting,
    uint256 Novoting,
    uint256 winner,
    address winnerAddress,
    uint256 quorumTarget,
    string status
);
