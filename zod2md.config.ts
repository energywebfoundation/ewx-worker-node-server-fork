import type { Config } from 'zod2md';

const config: Config = {
  entry: 'src/config.ts',
  title: 'Environment variable',
  output: 'docs/env-vars.md',
};

export default config;
