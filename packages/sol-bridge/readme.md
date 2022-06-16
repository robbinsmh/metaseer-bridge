## Claim Instruction
### call to program: BFzjrD1UqBTGSbnk2JgNeqp18drjA6jrbCGcngH9mh2A
### Data
    Instruction Code: 8 bytes = 3ec6d6c1d59f6cd2
    memberNonce: u8
    Amount: u64
    txId,
    signature,

### Keys
    {
        "name": "state", // 7jWm7EzjKfNcGYDzk6i2Kz3CvSWwMoMekznskbctzTJn
        "Writable": true,
        "isSigner": false
    },
    { 
        "name": "authority", // GdeTYNPec3WzLNswV78mUqjcCwXKT4eyyDUrXeDvzjxZ
        "Writable": false,
        "isSigner": false
    },
    {
        "name": "ownerTokenAccount", // HvatnD2pLfQyNdL6UVMr3DJFkskbPAcGNvmAnqDqCfRm
        "Writable": true,
        "isSigner": false
    },
    {
        "name": "user", // user's wallet
        "Writable": false,
        "isSigner": true
    },
    {
        "name": "userTokenAccount", // user's token account
        "Writable": true,
        "isSigner": false
    },
    {
        "name": "memberPublicKey", // member publickey
        "Writable": true,
        "isSigner": false
    },
    {
        "name": "tokenProgram",
        "Writable": false,
        "isSigner": false
    },
    {
        "name": "clock",
        "Writable": false,
        "isSigner": false
    },
    {
        "name": "rent", // SYSVAR_RENT_PUBKEY
        "Writable": false,
        "isSigner": false
    },
    {
        "name": "system_program", // web3.SystemProgram.programId
        "Writable": false,
        "isSigner": false
    } 

## How to deploy?
1. Change keys in crypt(crypt/src/crypt.rs)
    * CRYPT_ENCRYPT_KEY

    * INTERNAL_KEY

    * default-secret-word

2. Set keys in sol-bridge(sol-bridge/src/lib.rs)
    * MY-SECRET-SPELL
3. Set keys in settings(sol-bridge/src/settings.rs)
    * Salt: 32 chars

    * Secret: 32 chars

4. Build
```bash
yarn build
```

5. Deploy
```bash
yarn deploy
```

6. Create IDL
```bash
yarn idl
```
7. Create .env
    * Mint

    * Owner token account

8. Init
```bash
yarn initial
```

9. Show configs
```bash
yarn show
```
* Program Id
* State Account
* Authority
* Owner Token Account