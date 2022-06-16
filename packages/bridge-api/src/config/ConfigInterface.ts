export type AppEnv = 'development' | 'staging' | 'production';

export type BscToken = {
  decimals: number;
  token: string;
  slpTokenAddress: string;
};

export type SolToken = {
  decimals: number;
  token: string;
  wallet: string;
};

export type TokenPair = {
  bsc: BscToken;
  sol: SolToken;
}

interface ConfigInterface {
  readonly environment: AppEnv;
  readonly debug: boolean;
  readonly blake3HashSalt: string;
  readonly bscBridgeAddress: string;
  readonly bscJsonRpcEndpoint: string;
  readonly bscSignSecret: string;
  readonly solJsonRpcEndpoint: string;
  readonly solSignSecret: string;
  readonly tokenPairs: TokenPair[];
  readonly cors?: {
    readonly origin: string[];
  }
}

export default ConfigInterface;
