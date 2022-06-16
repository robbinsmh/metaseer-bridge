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
        console.log('Deploying BSCBridge on binance network.');
        await deployer.deploy(BSCBridge);
        bscchain = await BSCBridge.deployed();
        console.log(`BSCBridge address: ${bscchain.address}`);
    }else{
        console.log('Deploying BSCBridge on binance network.');
        await deployer.deploy(BSCBridge);
        bscchain = await BSCBridge.deployed();
        await bscchain.addTokenToBridge('0x2b759AB9495C5767cF775845A6246e405a87517C','0xEe33A178F09C5326141313f9bB7b275298A03705');
        console.log(`BSCBridge address: ${bscchain.address}`);
    }

}
