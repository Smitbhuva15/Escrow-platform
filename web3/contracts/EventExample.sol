// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EventExample {
    event ValueChanged(address indexed sender, uint256 newValue);

    uint256 public value;

    function setValue(uint256 _value) public {
        value = _value;
        emit ValueChanged(msg.sender, _value);
    }
}
