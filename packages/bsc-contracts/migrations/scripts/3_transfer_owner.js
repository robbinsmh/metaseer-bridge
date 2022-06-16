const BSCBridge = artifacts.require("BSCBridge.sol")
const Token = artifacts.require("BEP20.sol")
// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
    await Promise.all([deployToken(deployer, network, accounts)])
}

module.exports = migration

// ============ Deploy Functions ============

async function deployToken(deployer, network, accounts) {
    let bscchain;
    if (['dev'].includes(network)) {
        console.log('Not support for dev.');
    }else{
        console.log('Transfer Ownership.');
        const bridge = await BSCBridge.at('0x46f976d91d0fe8285e90d4a765884e91af291857');
        await bridge.transferTokenOwnership('0x2b759ab9495c5767cf775845a6246e405a87517c','0x4aeADe5169473615f6f87cD5F9cd6d38CD8e4602');
        console.log(`BSCBridge address: ${bridge.address}`);
    }

}
