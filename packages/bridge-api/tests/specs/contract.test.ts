import { BigNumber, ethers } from 'ethers';
import { BSCBridge__factory } from '../../src/bsc-contracts';
import util from 'util';

import config from '../../src/config';
import solContract, { parseConfirmedTransaction } from '../../src/libs/solContract';

describe('BSC Bridge Contract', () => {
  it('get signed message', async () => {
    const { tokenPairs, bscBridgeAddress } = config;
    const { slpTokenAddress } = tokenPairs[0].bsc;
    const txId = '2369VMnQNdNT4YyKHS5gHjfk9jUtaJ64BqAoU6gDr7gfcGoPvp12yUxBaVpsv3dSkopzCLzV9oyTqhoXjnehU1No';
    const RPC_HOST = 'https://data-seed-prebsc-1-s1.binance.org:8545';
    const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
    const bscSm = BSCBridge__factory.connect(bscBridgeAddress, provider);
    const message = await bscSm._verifyMessage(
      slpTokenAddress,
      BigNumber.from(100),
      '0x70b144972C5Ef6CB941A5379240B74239c418CD4',
      txId,
      config.bscSignSecret,
    );
    console.log('message:', message);
  });

  it('parse bsc transaction 1', async () => {
    const txId = 'tGA2eNAGHF11MAxGjgbJdUbRcaJvtaNAMigfEA5sVLaCwDqnqoYs5pbhFTh7zP9xEvbgUM3DN4fQb3RYnxoYaRR';
    const result = await solContract.getParsedConfirmedTransaction(txId, 'finalized');
    console.log('result:', util.inspect(result, { showHidden: false, depth: null }));

    if (!result) {
      throw new Error('invalid transaction');
    }

    let address;
    const logMessages = result.meta?.logMessages;

    if (logMessages) {
      const addressMemo = logMessages.find((m) =>
        m.startsWith('Program log: Memo')
      );

      if (addressMemo) {
        address = addressMemo.split('"')[1];
        console.log('address: ', address)
      }
    }

    expect(address).toEqual('0xd0e4fb3fa87d88b74ec365fddee42a6f6868f66c');

    const info = parseConfirmedTransaction(result);
    console.log('result:', util.inspect(info, { showHidden: false, depth: null }));
  });

  it('parse bsc transaction 2', async () => {
    const txId = '3gKrnvnzJaNrdATBvfyAB2B79FV14WSbUaWxqgntXcuhBLU9WPTbACwobo7SWt4pzrjTv9EN979FeuHiMq1KsJHL';
    const result = await solContract.getParsedConfirmedTransaction(txId, 'finalized');
    console.log('result:', util.inspect(result, { showHidden: false, depth: null }));

    if (!result) {
      throw new Error('invalid transaction');
    }

    const info = parseConfirmedTransaction(result);
    console.log('result:', util.inspect(info, { showHidden: false, depth: null }));
  });

  it('convert to ether', async () => {
    const amount = "1000000000";
    const decimals = 9;
    const amountInWei = BigNumber.from(amount).mul(10 ** (18 - decimals));
    expect(amountInWei.toString().length).toBe(19);
  });
});
