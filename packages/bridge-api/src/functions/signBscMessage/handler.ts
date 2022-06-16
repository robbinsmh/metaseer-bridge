import { BigNumber } from 'ethers';
import 'source-map-support/register';

import config from '../../config';
import { createJSONError, createJSONReponse, ValidatedEventAPIGatewayProxyEvent } from '../../libs/apiGateway';
import connectBridgeContract, { getTokenPairBySolToken } from '../../libs/connectBridgeContract';
import { middyfy } from '../../libs/lambda';
import * as logger from '../../libs/logger';
import solContract, { parseConfirmedTransaction } from '../../libs/solContract';
import schema from './schema';

const { bscSignSecret } = config;

async function parseTransaction(txId: string) {
  let result;

  try {
    result = await solContract.getParsedConfirmedTransaction(txId, 'finalized');
  } catch (err) {
    throw new Error('failed to parsed transaction');
  }

  if (!result) {
    throw new Error('invalid transaction')
  }

  return result;
}

const signBscMessage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const {
      body: { address, txId },
    } = event;

    console.log(`signing transaction ${txId.substr(0, 4)}...`);
    let result = await parseTransaction(txId);

    let addressInTx;

    if (result.meta?.logMessages) {
      const addressLog = result.meta?.logMessages.find((m) => m.startsWith('Program log: Memo'));

      if (addressLog) {
        addressInTx = addressLog.split('"')[1];
      }
    }

    if (address !== addressInTx) {
      throw new Error('invalid user address');
    }

    const {
      destination,
      mint,
      tokenAmount: { amount, decimals },
    } = parseConfirmedTransaction(result);

    const { bsc: bscToken, sol: solToken } = getTokenPairBySolToken(mint);

    if (destination !== solToken.wallet) {
      throw new Error('invalid transaction info');
    }

    const bscContract = connectBridgeContract();
    const amountInWei = BigNumber.from(amount).mul(10 ** (bscToken.decimals - decimals));
    const signature = await bscContract._verifyMessage(
      bscToken.slpTokenAddress,
      amountInWei,
      address,
      txId,
      bscSignSecret
    );

    return createJSONReponse({
      message: signature,
    });
  } catch (err) {
    logger.debug('err:', (err as Error).stack || err);
    throw createJSONError(400, (err as Error).message);
  }
};

export const main = middyfy(signBscMessage);
