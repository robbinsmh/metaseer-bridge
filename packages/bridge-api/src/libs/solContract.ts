import { Connection, ParsedConfirmedTransaction, ParsedInstruction, TokenAmount } from '@solana/web3.js';

import config from '../config';

export type SolTransferInstruction = {
  authority: string;
  destination: string;  // Sol MoWallet
  mint: string;         // token address
  source: string;       // user token account
  tokenAmount: TokenAmount;
}

const {
  solJsonRpcEndpoint,
} = config;

export function parseConfirmedTransaction(transaction: ParsedConfirmedTransaction): SolTransferInstruction {
  if (!transaction || !(transaction.transaction?.message?.instructions[0] as ParsedInstruction).parsed) {
    throw new Error('not a valid parseable transaction');
  }

  const { parsed: { info } } = transaction.transaction.message.instructions[0] as ParsedInstruction;

  return info as SolTransferInstruction;
};

const solContract = new Connection(solJsonRpcEndpoint as string);

export default solContract;
