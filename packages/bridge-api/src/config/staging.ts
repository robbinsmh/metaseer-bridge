import createConfig from './createConfig';
import { getTokenPairsFromEnv } from './default';

const config = createConfig({
  environment: 'staging',
  debug: !!process.env.DEBUG,
  blake3HashSalt: process.env.BLAKE3_HASH_SALT,
  bscBridgeAddress: process.env.BSC_BRIDGE_ADDRESS,
  bscJsonRpcEndpoint: process.env.BSC_JSON_RPC_ENDPOINT || 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  bscSignSecret: process.env.BSC_SIGN_SECRET,
  solJsonRpcEndpoint: process.env.SOL_JSON_RPC_ENDPOINT || 'https://api.devnet.solana.com',
  solSignSecret: process.env.SOL_SIGN_SECRET,
  tokenPairs: getTokenPairsFromEnv(),
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['*'],
  }
});

export default config;
