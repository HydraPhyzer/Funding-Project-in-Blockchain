// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Funder {
    uint256 public Count;
    mapping(uint256 => address) public Fundings;

    receive() external payable {}

    function Checker() private view returns (bool) {
        for (uint256 i = 0; i <= Count; i++) {
            if (Fundings[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }

    function Transfer() external payable {
        if (Checker() == false) {
            Fundings[Count++] = msg.sender;
        }
    }

    function Withdraw(uint256 Val) external {
        require(Val <= 2000000000000000000, "Please Withdraw Must <= 2ETH");
        payable(msg.sender).transfer(Val);
    }
}
