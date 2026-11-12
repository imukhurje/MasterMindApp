// metro.config.cjs
const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Always resolve 'pusher-js' to its RN bundle:
const rnPusherPath = path.join(
  __dirname,
  'node_modules',
  'pusher-js',
  'dist',
  'react-native',
  'pusher.js'
);

defaultConfig.resolver = {
  ...(defaultConfig.resolver || {}),
  extraNodeModules: {
    ...(defaultConfig.resolver?.extraNodeModules || {}),
    'pusher-js': rnPusherPath,
  },
  unstable_enablePackageExports: true,
};

module.exports = mergeConfig(defaultConfig, {});
