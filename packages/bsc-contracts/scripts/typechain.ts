import { resolve } from 'path';
import { runTypeChain, glob } from 'typechain';

async function main() {
  const cwd = resolve(__dirname, '..');
  const allFiles = glob(cwd, [`build/contracts/*.json`])

  const result = await runTypeChain({
    cwd,
    filesToProcess: allFiles,
    allFiles,
    outDir: resolve(__dirname, '../contracts-out'),
    target: 'ethers-v5',
  })

  console.log('result:', result);
}

main().catch(console.error)
