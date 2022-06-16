import * as assert from 'assert';
import { ethers } from 'ethers';
import fetch from "node-fetch";

import { BSCBridge__factory } from '../bsc-contracts';

// tslint:disable-next-line:no-any
declare var global: any;
global.fetch = fetch;

import config from '../config';

const {
  bscBridgeAddress,
  bscJsonRpcEndpoint,
  tokenPairs,
} = config;

assert.ok(bscJsonRpcEndpoint);

export const bscProvider = new ethers.providers.JsonRpcProvider(bscJsonRpcEndpoint);

export function getTokenPairByBscToken(bscToken: string) {
  const tokenPair = tokenPairs.find((tokenPair) => tokenPair.bsc.token === bscToken);

  if (!tokenPair) {
    throw new Error(`Invalid bsc token "${bscToken}"`);
  }

  return tokenPair;
}

export function getTokenPairBySolToken(solToken: string) {
  const tokenPair = tokenPairs.find((tokenPair) => tokenPair.sol.token === solToken);

  if (!tokenPair) {
    throw new Error(`Invalid sol token "${solToken}"`);
  }

  return tokenPair;
}

export default function connectBridgeContract() {
  return BSCBridge__factory.connect(bscBridgeAddress, bscProvider);
}
