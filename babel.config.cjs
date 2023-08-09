// This Babel config is purely for Jest. The library itself is transpiled with
// TypeScript.
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
};
