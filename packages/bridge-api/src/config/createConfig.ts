import { mergeWith } from 'lodash';
import { PartialDeep } from 'type-fest';

import ConfigInterface from './ConfigInterface';
import defaultConfig from './default';

export default function createConfig(config: PartialDeep<ConfigInterface>): ConfigInterface {
  return mergeWith({}, defaultConfig, config, (a, b) => b === null ? a : undefined) as ConfigInterface;
}
