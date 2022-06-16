require('dotenv').config();
const serum = require('@project-serum/serum');
const anchor = require('@project-serum/anchor');

const BufferLayout = require('buffer-layout');
const borsh = require('@project-serum/borsh');

const { generateMemberAccount } = require('./generate-member-account-publickey');
var { mint, secret, signMessage, getProvider } = require('./utils');
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

  const userTokenAccountAddress = process.env.USER_TOKEN_ACCOUNT;

  const userTokenAccount = new anchor.web3.PublicKey(userTokenAccountAddress);
  const bepToken = '0x6aeb6ae79f05100faa0d9816fef6366f13b984de';
  const amount = new anchor.BN(100);
  const txId = '0x63b9f9711f98981c9c1abe7495d6e921528a10dfbfaaa8866926735f21fa7e14';
  // const signature = 'FMGhdKS8j5/4kpAHaOtxqYSHPBuWRBNNnvgAbCfzsMLyiSrAZDwwR/ZaMnxudpZ+0D8HvSwJxOwz/JqwZSnzAQ==';
  const signature = await signMessage(
    program.programId.toBase58(),
    bepToken,
    mint,
    userTokenAccountAddress,
    amount,
    txId,
    secret
  );

  let [memberPublicKey, memberNonce] = await generateMemberAccount(txId, program.programId);
  console.log('member: ', memberPublicKey.toString(), memberNonce);

  const strTypeDataLayout = BufferLayout.struct([
    borsh.u8('memberNonce'),
    borsh.str('bepToken'),
    borsh.u64('amount'),
    borsh.str('tx_id'),
    borsh.str('signature'),
  ]);

  let strTypeBuffer = Buffer.alloc(1024);
  const encodeLength = strTypeDataLayout.encode(
    {
      memberNonce,
      bepToken,
      amount,
      tx_id: txId,
      signature,
    },
    strTypeBuffer
  );
  strTypeBuffer = strTypeBuffer.slice(0, encodeLength);

  const code = Buffer.from('3ec6d6c1d59f6cd2', 'hex');
  const data = Buffer.concat([code, strTypeBuffer]);

  /*
  const amountBuffer = amount.toArrayLike(Buffer, 'be', 8);
  code = Buffer.from('3ec6d6c1d59f6cd2', 'hex');

  data = Buffer.concat([code, amountBuffer, data]);
  console.log(data.toString('hex').match(/../g).join(''));
  */
  const keys = [
    {
      pubkey: statePubKey,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: authority,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: ownerTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: provider.wallet.publicKey, // user's wallet
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: userTokenAccount, // user's token account
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: memberPublicKey, // member publickey
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: serum.TokenInstructions.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: anchor.web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ];

  var transaction = new anchor.web3.Transaction();

  transaction.add(
    new anchor.web3.TransactionInstruction({
      keys,
      programId: program.programId,
      data,
    })
  );

  try {
    const tx = await anchor.web3.sendAndConfirmTransaction(provider.connection, transaction, [provider.wallet.payer]);
    console.log('tx', tx);
    console.log('tx link', `https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  } catch (err) {
    console.log('Claim', err);
  }
}

console.log('Running claim.');
main()
  .then(() => {
    console.log('Success');
    process.exit();
  })
  .catch((err) => {
    console.error('error:', err);
  });
