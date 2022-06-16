pragma solidity >=0.6.12;

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract Sigs {

    using ECDSA for bytes32;

    function secretHash(uint256 block)  public pure returns(bytes32) {
        return keccak256(abi.encodePacked(block,'0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000'));
    }

    function _verifyMessage(address _slpToken, uint256 _amount, address _sender, string memory _transitId, bytes32 _secret) public view returns(bytes32) {
        uint chainId;
        assembly {
            chainId := chainid()
        }
        return keccak256(abi.encodePacked(chainId, address(this), _slpToken, _amount, _sender, _transitId, _secret));
    }
}
