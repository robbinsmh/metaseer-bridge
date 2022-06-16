import config from '../config';

export function debug(...args: unknown[]) {
  if (config.debug) {
    console.log(args);
  }
}

export function error(...args: unknown[]) {
  console.error(args);
}

export function warn(...args: unknown[]) {
  console.warn(args);
}
