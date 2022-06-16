require('dotenv').config();
const serum = require('@project-serum/serum');
const anchor = require('@project-serum/anchor');

var { mint, secret, signMessage, getProvider } = require('./utils');
var { getProgram } = require('./programs');
const { generateMemberAccount } = require('./generate-member-account-publickey');

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
  console.log('authority', authority.toString());

  const userTokenAccountAddress = process.env.USER_TOKEN_ACCOUNT;
  console.log('userTokenAccountAddress', userTokenAccountAddress);

  const userTokenAccount = new anchor.web3.PublicKey(userTokenAccountAddress);
  const bepToken = '0x2b759AB9495C5767cF775845A6246e405a87517C';
  var amount = new anchor.BN(1_000_000_000);
  var txId = '0x98e71813fbb314e3cd9d9b687ae1cfc4931fbfbb00737062538673e6517fd3e4';
  var signature = await signMessage(
    program.programId.toBase58(),
    bepToken,
    mint,
    userTokenAccountAddress,
    amount,
    txId,
    secret
  );

  console.log('signature:', signature);

  //let seedPublicKey = await generateSeedAddress(provider.wallet.publicKey, signature, program.programId);
  //console.log("seedPublicKey: ", seedPublicKey.toString())
  let [memberPublicKey, memberNonce] = await generateMemberAccount(txId, program.programId);
  console.log('member: ', memberPublicKey.toString());

  // testing
  // memberNonce = 1;
  // memberPublicKey = new anchor.web3.PublicKey('BjyTSBWuSkFihrrCawkAT7oEbBkyZA1gMovqUAJHQzzK');
  // signature = await signMessage(userTokenAccountAddress, new anchor.BN(101), txId, secret);
  // signature = "98579c67e89ea825e9a099a138ee0a839851dda77700a26cffcc7a583b9283f9"
  // amount = new anchor.BN(001)
  // txId = '0x63b9f9711f98989c9c1fbe7495c6e921528a10dfbfaaa8866926735f21fa7e19';

  console.log('accounts:', {
      state: statePubKey.toString(),
      authority: authority.toString(),
      ownerTokenAccount: ownerTokenAccount.toString(),
      user: provider.wallet.publicKey.toString(), // owner == user
      userTokenAccount: userTokenAccount.toString(),
      //seed: seedPublicKey,
      member: memberPublicKey.toString(),
      tokenProgram: serum.TokenInstructions.TOKEN_PROGRAM_ID.toString(),
      clock: anchor.web3.SYSVAR_CLOCK_PUBKEY.toString(),
      rent: anchor.web3.SYSVAR_RENT_PUBKEY.toString(),
      systemProgram: anchor.web3.SystemProgram.programId.toString(),
    },)

  let tx = await program.rpc.claim(memberNonce, bepToken, amount, txId, signature, {
    accounts: {
      state: statePubKey,
      authority,
      ownerTokenAccount,
      user: provider.wallet.publicKey, // owner == user
      userTokenAccount,
      //seed: seedPublicKey,
      member: memberPublicKey,
      tokenProgram: serum.TokenInstructions.TOKEN_PROGRAM_ID,
      clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  console.log('tx', tx);
  console.log('tx link', `https://explorer.solana.com/tx/${tx}?cluster=devnet`);
}

console.log('Running claim.');
main().then(() => {
  console.log('Success');
  process.exit();
}).catch((err) => {
  console.error('error:', err);
});

module.exportss = {
  signMessage,
  secret,
};
