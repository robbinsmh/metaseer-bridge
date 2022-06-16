import crypto from 'crypto';

console.log('buffer length:', Buffer.from('X+ClQyQvwAMxsroiIrC0K8bl9I6uEMMHAg0rfgAug+Y=', 'base64').length);

const privateKey = crypto.createPrivateKey({
  key: Buffer.from('MC4CAQAwBQYDK2VwBCIEIDCKvHOHUcQ5F6qzPQMFMvyN5DosGsy4s61arLVu7HKe', 'base64'),
  format: 'der',
  type: 'pkcs8'
});

const publicKey = crypto.createPublicKey({
  key: Buffer.from('MCowBQYDK2VwAyEAnpPelIgu0nG+rozw6qcF7gFaUnZ6K0dMguZi6Q9UCAs=', 'base64'),
  format: 'der',
  type: 'spki'
});

const message = 'Hello world!';
console.log(message);

const signature = crypto.sign(null, Buffer.from(message), privateKey);
console.log('signature:', { length: signature.length, base64: signature.toString('base64') });

const verified = crypto.verify(null, Buffer.from(message), publicKey, signature)
console.log('Match:', verified);

const privateKeyDer = privateKey.export({ format: 'der', type: 'pkcs8' }).slice(16);
const publicKeyDer = publicKey.export({ format: 'der', type: 'spki' }).slice(12);

const keyPair = Buffer.concat([privateKeyDer, publicKeyDer]).toString('base64');
console.log('key pair:', { keyPair, l: keyPair.length });
