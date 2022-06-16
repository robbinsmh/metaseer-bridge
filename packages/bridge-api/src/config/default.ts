import { PartialDeep } from 'type-fest';

import ConfigInterface from './ConfigInterface';

export function getTokenPairsFromEnv() {
  if (!process.env.TOKEN_PAIRS) {
    throw new Error("Token pairs haven't bean configured");
  }

  return JSON.parse(process.env.TOKEN_PAIRS);
}

const config: PartialDeep<ConfigInterface> = {
  environment: 'development',
  debug: !!process.env.DEBUG,
  blake3HashSalt: 'meta18vd8fpwxzck5n896xz12em5seer',
  bscBridgeAddress: '0x4aeADe5169473615f6f87cD5F9cd6d38CD8e4602',
  bscJsonRpcEndpoint: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  bscSignSecret: '0x94ad068efd25865f9a7323dba6b119a08171d0d51a7d2cd41ef17cea877cb19a',
  solJsonRpcEndpoint: 'https://api.devnet.solana.com',
  solSignSecret: 'meta174kgn5rtw4kf6f938wm7kwh70h2v4vcfd26jlc',
  tokenPairs: [
    {
      bsc: {
        decimals: 18,
        token: '0x2b759AB9495C5767cF775845A6246e405a87517C',
        slpTokenAddress: '0xEe33A178F09C5326141313f9bB7b275298A03705',
      },
      sol: {
        decimals: 9,
        token: '6JMenadSsShX5gdyfK4RKzBFTGgLvj3QLNTnkwES7H1j',
        wallet: '63Nfg5RFdu2MZpbgtz7ERJZK37auwDfRQoUeg7PbAETx',
      },
    },
    {
      bsc: {
        decimals: 18,
        token: '0xDF3FE6Ac04e0e03270e6F4E6E30dF73Ad5d8f330',
        slpTokenAddress: '0xd559e668ba6cc36e26e75a51b5668cfc6407d8d5',
      },
      sol: {
        decimals: 9,
        token: '2WHNoAUxrd4T7y6oV64XHo38oo5tsdggiU71kbidKj7J',
        wallet: 'AnaXKwUk3EXeJZd8GwspefVsCtKnueaaLRdx5UHHYhU2',
      },
    },
  ],
  cors: {
    origin: ['*'],
  },
};

export default config;
