import { BigNumber, ethers } from 'ethers';
import { ABI } from '../../src/functions/signSolMessage/handler';

describe('#Functions Claim sol token', () => {
  it('it should be able to get tranasction receipt', async () => {
    const RPC_HOST = 'https://data-seed-prebsc-1-s1.binance.org:8545';
    const TXID = '0x98e71813fbb314e3cd9d9b687ae1cfc4931fbfbb00737062538673e6517fd3e4';
    const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
    const tx = await provider.getTransaction(TXID);
    const abiInterface = new ethers.utils.Interface(ABI);
    const decodedInput = abiInterface.parseTransaction({ data: tx.data, value: tx.value });
    // Decoded Transaction
    // console.log({
    //   function_name: decodedInput.name,
    //   from: tx.from,
    //   to: decodedInput.args[0],
    //   erc20Value: Number(decodedInput.args[1]) / 10 ** 9,
    // });
    console.log('decodedInput:', decodedInput.args);
    const amount = decodedInput.args[1];
    const amountInWei = BigNumber.from(amount).div(10 ** (18 - 9));
    console.log('amount:', { amount, amountInWei: amountInWei.toBigInt() });
    console.log('_bepToken:', decodedInput.args['_bepToken']);
    // const data = ethers.utils.defaultAbiCoder.decode(
    //     [ 'bytes32', 'string' ],
    //     ethers.utils.hexDataSlice(tx.data, 4)
    // );

    // console.log('data:', data);
    // expect(transactionReceipt.from).toBe(bscSmAddress);
    // expect(transactionReceipt.confirmations).toBeGreaterThan(0);
  });
});
