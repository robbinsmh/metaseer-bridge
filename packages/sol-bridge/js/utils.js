/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

const os = require('os');
const fs = require('mz/fs');
const path = require('path');
const yaml = require('yaml');
const anchor = require('@project-serum/anchor');
const { sha256 } = require('crypto-hash');
const { blake3 } = require('hash-wasm');

const mint = process.env.MINT;
const secret = 'meta174kgn5rtw4kf6f938wm7kwh70h2v4vcfd26jlc';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @private
 */
async function getConfig() {
  // Path to Solana CLI config file
  const CONFIG_FILE_PATH = path.resolve(os.homedir(), '.config', 'solana', 'cli', 'config.yml');
  const configYml = await fs.readFile(CONFIG_FILE_PATH, { encoding: 'utf8' });
  return yaml.parse(configYml);
}

/**
 * Load and parse the Solana CLI config file to determine which RPC url to use
 */
async function getRpcUrl() {
  try {
    const config = await getConfig();
    if (!config.json_rpc_url) throw new Error('Missing RPC URL');
    return config.json_rpc_url;
  } catch (err) {
    console.warn('Failed to read RPC url from CLI config file, falling back to localhost');
    return 'http://localhost:8899';
  }
}

async function getConnection() {
  const rpcUrl = await getRpcUrl();
  console.log(rpcUrl);

  const connection = new anchor.web3.Connection(rpcUrl, 'confirmed');

  const version = await connection.getVersion();
  console.log('Connection to cluster established:', rpcUrl, version);

  return connection;
}
/**
 * Load and parse the Solana CLI config file to determine which payer to use
 */
async function getPayerWallet(connection) {
  try {
    const config = await getConfig();
    if (!config.keypair_path) throw new Error('Missing keypair path');
    const ownerAccount = await readAccountFromFile(config.keypair_path);

    const lamports = await connection.getBalance(ownerAccount.publicKey);

    console.log(
      'Using account',
      ownerAccount.publicKey.toBase58(),
      'containing',
      lamports / anchor.web3.LAMPORTS_PER_SOL,
      'SOL to pay for fees'
    );

    const wallet = new anchor.Wallet(ownerAccount);

    return wallet;
  } catch (err) {
    console.warn('Failed to read keypair from CLI config file, falling back to new random keypair', err);
    return null;
  }
}

async function getProvider() {
  const connection = await getConnection();
  const wallet = await getPayerWallet(connection);

  const opts = { preflightCommitment: 'recent', commitment: 'confirmed' };
  const provider = new anchor.Provider(connection, wallet, opts);

  return provider;
}

/**
 * Create an Account from a keypair file
 */
async function readAccountFromFile(filePath) {
  const keypairString = await fs.readFile(filePath, { encoding: 'utf8' });
  return anchor.web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keypairString)));
}

async function generateInstructionNumber(functionName) {
  const preimage = `global:${functionName}`;
  const hash = await sha256(preimage);
  return hash.slice(0, 16);
}

async function signMessage(program, bepToken, solToken, address, amount, txId, secret) {
  const key = 'meta18vd8fpwxzck5n896xz12em5seer';
  let message = program + bepToken + solToken + address + amount + txId + secret;
  console.log('message:', message);
  return blake3(message, 256, key);
}

module.exports = {
  mint,
  secret,
  getConnection,
  getProvider,
  readAccountFromFile,
  generateInstructionNumber,
  signMessage,
};
