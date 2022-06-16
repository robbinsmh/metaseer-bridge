import ConfigInterface, { AppEnv } from './ConfigInterface';

const env = (process.env.NODE_ENV || 'development') as AppEnv;

if (!env) {
  throw new Error('Env required');
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config: ConfigInterface = require(`./${env}`).default;

export default config as ConfigInterface;
