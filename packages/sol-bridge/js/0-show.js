require('dotenv').config();
const serumCmn = require("@project-serum/common");
const serum = require("@project-serum/serum");
const anchor = require('@project-serum/anchor');
const tokenInLamport = anchor.web3.LAMPORTS_PER_SOL;

var { getProvider} = require('./utils');
var { getProgram } = require('./programs');

async function main() {
  const provider = await getProvider();
  anchor.setProvider(provider);

  const program = await getProgram();
  const statePublicKey = await program.state.address();
  console.log('State Account:', statePublicKey.toBase58());

  const [authority, nonce] = await anchor.web3.PublicKey.findProgramAddress(
    [statePublicKey.toBuffer(), Buffer.from('MqFAWemmfzjbZd6kaiHkarHs3g3tDg1C')],
    program.programId
  );

  console.log('Authority:', authority.toBase58());

  console.log('Owner Token Account:', process.env.OWNER_TOKEN_ACCOUNT);
  
  const state = await program.state.fetch();
  console.log('state:', state);
}

console.log('Running client.');
main().then(() => { console.log('Success'); process.exit();})
