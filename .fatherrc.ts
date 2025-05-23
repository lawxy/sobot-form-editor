import { defineConfig } from 'father';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  esm: { output: 'es' },
  cjs: {
    output: 'lib',
    // platform: 'browser', // 设置 platform 为 'browser'
  },
  // umd: {
  //   output: 'umd',
  // },
});
