const anchor = require('@project-serum/anchor');

async function generateMemberAccount(tx_id, programId) {
  let seeds = [
    Buffer.from(tx_id.substring(2, 34)),
    Buffer.from(tx_id.substring(34))
  ];
  
  return anchor.web3.PublicKey.findProgramAddress(seeds, programId);
}

module.exports = {
  generateMemberAccount
};