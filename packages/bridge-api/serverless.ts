import type { AWS } from '@serverless/typescript';

require('dotenv').config()

import config from './src/config';
import { signBscMessage, signSolMessage } from './src/functions';

const origin = config.cors?.origin;
const allowCredentials = !(origin && origin.includes('*'));

const serverlessConfiguration: AWS = {
  service: 'orisis-metaseer-api',
  frameworkVersion: '2',
  variablesResolutionMode: '20210326',
  configValidationMode: 'warn',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'ap-southeast-1',
    stage: '${opt:stage, "development"}',
    memorySize: 256,
    timeout: 10,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_ENV: '${env:NODE_ENV}',
      DEBUG: '${env:DEBUG, 0}',
      BLAKE3_HASH_SALT: '${env:BLAKE3_HASH_SALT}',
      BSC_BRIDGE_ADDRESS: '${env:BSC_BRIDGE_ADDRESS}',
      BSC_JSON_RPC_ENDPOINT: '${env:BSC_JSON_RPC_ENDPOINT}',
      BSC_SIGN_SECRET: '${env:BSC_SIGN_SECRET}',
      SOL_JSON_RPC_ENDPOINT: '${env:SOL_JSON_RPC_ENDPOINT}',
      SOL_SIGN_SECRET: '${env:SOL_SIGN_SECRET}',
      TOKEN_PAIRS: '${env:TOKEN_PAIRS}',
    },
    lambdaHashingVersion: '20201221',
    httpApi: {
      cors: {
        allowedOrigins: origin,
        allowedHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'X-Amz-Security-Token',
          'X-Amz-User-Agent',
        ],
        allowedMethods: ['GET', 'POST', 'OPTIONS'],
        allowCredentials,
        exposedResponseHeaders: ['Special-Response-Header'],
        maxAge: 84400,
      },
    },
  },
  functions: { signBscMessage, signSolMessage },
  useDotenv: true
};

module.exports = serverlessConfiguration;
