import * as assert from 'assert';
import { BigNumber, ethers } from 'ethers';
import { blake3 } from 'hash-wasm';
import 'source-map-support/register';

import config from '../../config';
import { createJSONError, createJSONReponse, ValidatedEventAPIGatewayProxyEvent } from '../../libs/apiGateway';
import { bscProvider, getTokenPairByBscToken } from '../../libs/connectBridgeContract';
import { middyfy } from '../../libs/lambda';
import * as logger from '../../libs/logger';
import schema from './schema';

const { blake3HashSalt, bscBridgeAddress, solSignSecret, tokenPairs } = config;

assert.ok(blake3HashSalt, 'blake3HashSalt not specified');
assert.ok(bscBridgeAddress, 'bscBridgeAddress not specified');
assert.ok(solSignSecret, 'solSignSecret not specified');
assert.ok(tokenPairs.length, 'tokenPairs not specified');

export type SignSolMessageEvent = ValidatedEventAPIGatewayProxyEvent<typeof schema>;

export const ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_bepToken', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'string', name: '_tokenAccount', type: 'string' },
    ],
    name: 'payback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

function getTokenPair(bepToken: string) {
  try {
    return getTokenPairByBscToken(bepToken);
  } catch (error) {
    logger.error('Failed to get token pair', error);
    throw createJSONError(400, 'Failed to get token pair');
  }
}

function parseTransaction(transaction: ethers.providers.TransactionResponse) {
  try {
    const abiInterface = new ethers.utils.Interface(ABI);
    const decodedInput = abiInterface.parseTransaction({ data: transaction.data, value: transaction.value });

    assert.strictEqual(decodedInput.args.length, 3, 'invalid transaction input');

    return decodedInput;
  } catch (error) {
    logger.error('Failed to parse transaction', error);
    throw createJSONError(400, 'Failed to parse transaction');
  }
}

async function fetchTransactionInfo(txId: string) {
  try {
    return bscProvider.getTransaction(txId);
  } catch (error) {
    logger.error('Failed to fetch transaction info', error);
    throw createJSONError(400, 'failed to retrieve transaction');
  }
}

export const signSolMessage: SignSolMessageEvent = async (event) => {
  try {
    const {
      body: { address, txId },
    } = event;

    const transaction = await fetchTransactionInfo(txId);
    const decodedInput = parseTransaction(transaction);
    const amount = decodedInput.args[1];
    const [programId, slpToken] = decodedInput.args[2].split(';');
    const bepToken = decodedInput.args['_bepToken'];

    assert.ok(programId, 'programId not valid');

    if (slpToken !== address) {
      throw new Error('invalid spl token');
    }

    const { bsc: bscToken, sol: solToken } = getTokenPair(bepToken);
    const { to } = transaction;

    if (to !== bscBridgeAddress) {
      throw new Error('invalid transaction info');
    }

    if (bepToken !== bscToken.token) {
      throw new Error('invalid token');
    }

    const amountInWei = BigNumber.from(amount).div(BigNumber.from(10).pow(bscToken.decimals - solToken.decimals));

    const message = programId + bepToken + solToken.token + address + amountInWei.toString() + txId + solSignSecret;
    logger.debug('message:', message);

    const signature = await blake3(message, 256, blake3HashSalt);

    return createJSONReponse({
      message: signature,
    });
  } catch (err) {
    logger.debug('err:', (err as Error).stack || err);
    throw createJSONError(400, (err as Error).message);
  }
};

export const main = middyfy(signSolMessage);
