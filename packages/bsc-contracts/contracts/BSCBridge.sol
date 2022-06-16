pragma solidity >=0.6.12;
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import './BEP20.sol';
import './TransferHelper.sol';

contract BSCBridge is Ownable {

    using ECDSA for bytes32;
    using SafeMath for uint;

    mapping(string => bool) executed;
    mapping(address => address) slpToBep;
    mapping(address => address) bepToSlp;

    bytes32 private secret = keccak256(abi.encodePacked(block.number,'0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000'));

    event Bridge(address indexed slpToken, address indexed bepToken);
    event Transit(address indexed slpToken, address indexed to, uint256 amount, string transitId);
    event Payback(address indexed slpToken, address indexed to, uint256 amount, string _metadata);

    constructor() public {}

    function deployBridgeBep20Token(address _slpToken,string memory _name, string memory _symbol) onlyOwner external {
        require(_slpToken != address(0), "invalid token");
        bytes memory bytecode = abi.encodePacked(type(BEP20).creationCode, abi.encode(_name, _symbol));
        bytes32 salt = keccak256(abi.encodePacked(_slpToken, _name, _symbol));
        address _newToken;
        assembly {
            _newToken := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        slpToBep[_slpToken] = _newToken;
        bepToSlp[_newToken] = _slpToken;
        emit Bridge(_slpToken, _newToken);
    }

    function transit(address _slpToken, uint256 _amount, string memory _transitId, bytes32 _signature) external {
        require(slpToBep[_slpToken] != address(0), "token not support to bridge");
        require(!executed[_transitId], "already transit");
        require(_amount > 0, "amount must be greater than 0");

        bytes32 signature = _verifyMessage(_slpToken, _amount, msg.sender, _transitId, secret);
        require(signature == _signature, "invalid signature");

        BEP20(slpToBep[_slpToken]).mint(msg.sender, _amount);
        executed[_transitId] = true;
        emit Transit(_slpToken, msg.sender, _amount, _transitId);
    }

    function payback(address _bepToken, uint256 _amount, string memory _metadata) external {
        address slpToken = bepToSlp[_bepToken];

        require(slpToken != address(0), "invalid token");
        require(_amount > 0, "amount must be greater than 0");

        BEP20(_bepToken).burn(msg.sender, _amount);
        emit Payback(slpToken, msg.sender, _amount, _metadata);
    }

    function transferTokenOwnership(address _bepToken, address _to) onlyOwner external {
        address slpToken = bepToSlp[_bepToken];
        require(bepToSlp[_bepToken] != address(0), "invalid token");

        BEP20(_bepToken).transferOwnership(_to);
        slpToBep[slpToken] = address(0);
        bepToSlp[_bepToken] = address(0);
    }

    function addTokenToBridge(address _bepToken,address _slpToken) onlyOwner external {
        slpToBep[_slpToken] = _bepToken;
        bepToSlp[_bepToken] = _slpToken;
        emit Bridge(_slpToken, _bepToken);
    }

    function _verifyMessage(address _slpToken, uint256 _amount, address _sender, string memory _transitId, bytes32 _secret) public view returns(bytes32) {
        uint chainId;
        assembly {
            chainId := chainid()
        }
        return keccak256(abi.encodePacked(chainId, address(this), _slpToken, _amount, _sender, _transitId, _secret));
    }

}
