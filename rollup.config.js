import ts from '@rollup/plugin-typescript';

export default {
  input: './src/index.ts',
  output: {
    dir: './dist',
    name: 'EventTargetPortable',
    format: 'umd'
  },
  plugins: [ts()]
};
