const path = require('path');
const anchor = require('@project-serum/anchor');
const {sha256} = require('crypto-hash');

var { readAccountFromFile } = require('./utils');

async function getProgram() {
  const PROGRAM_PATH = path.resolve(__dirname, `../dist`);
  const PROGRAM_NAME = 'sol_bridge'
  const PROGRAM_KEYPAIR_PATH = path.join(PROGRAM_PATH, PROGRAM_NAME + '-keypair.json');
  const PROGRAM_IDL_PATH = path.join(PROGRAM_PATH, 'idl.json');

  try {
    const programAccount = await readAccountFromFile(PROGRAM_KEYPAIR_PATH);

    console.log('Program', programAccount.publicKey.toBase58());

    const idl = JSON.parse(require('fs').readFileSync(PROGRAM_IDL_PATH, 'utf8'));

    const program = new anchor.Program(idl, programAccount.publicKey);

    return program;
  } catch (err) {
    console.error('get program failed:', err.stack);
    // const errMsg = (err).message;
    // throw new Error(
    //   `Failed to read program keypair at ${PROGRAM_KEYPAIR_PATH} due to error: ${errMsg}. Program may need to be deployed with \`solana program deploy dist/${PROGRAM_NAME}.so\``,
    // );
  }
}

async function generatePoolAccount(walletPublicKey, programId) {
  const buffer = Buffer.concat([
    walletPublicKey.toBuffer(),
    Buffer.from(String(process.env.POOL_NAME)),
    programId.toBuffer(),
  ]);
  const hash = await sha256(new Uint8Array(buffer));
  const seedarray = Buffer.from(hash, 'hex');

  return anchor.web3.Keypair.fromSeed(seedarray);
}

module.exports = { getProgram, generatePoolAccount };
