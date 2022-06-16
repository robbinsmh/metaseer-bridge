require('dotenv').config();
const serumCmn = require("@project-serum/common");
const serum = require("@project-serum/serum");
const anchor = require('@project-serum/anchor');
const assert = require('assert');

const supportedMints = process.env.SUPPORTED_MINTS;
assert.ok(supportedMints, 'SUPPORTED_MINTS not defined');

var { getProvider} = require('./utils');
var { getProgram } = require('./programs');

async function main() {
  const provider = await getProvider();
  anchor.setProvider(provider);

  const program = await getProgram();
  const statePubKey = await program.state.address();

  const ownerTokenAccount = new anchor.web3.PublicKey(process.env.OWNER_TOKEN_ACCOUNT);

  const [authority, nonce] = await anchor.web3.PublicKey.findProgramAddress(
    [statePubKey.toBuffer(), Buffer.from('MqFAWemmfzjbZd6kaiHkarHs3g3tDg1C')],
    program.programId
  );

  const approveAmount = new anchor.BN(1_000_000);

  console.log(`spl-token approve ${process.env.OWNER_TOKEN_ACCOUNT} ${approveAmount.toString()} ${authority.toBase58()}`)

  console.log('supportedMints:', supportedMints);

  await program.state.rpc.new(
    supportedMints,
    nonce,
    {
      accounts: {
        owner: provider.wallet.publicKey,
      },
      instructions: [
        serum.TokenInstructions.approve({
          source: ownerTokenAccount,
          delegate: authority,
          amount: approveAmount,
          owner: provider.wallet.publicKey
        }),
      ],
    }
  );

  const state = await program.state.fetch();
  console.log('state:', state);
}

console.log('Running initialize.');
main().then(() => { console.log('Success'); process.exit();})
