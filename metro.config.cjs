const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force Metro to resolve CommonJS (prevents zustand ESM import.meta on web)
config.resolver.unstable_conditionNames = ['react-native', 'require', 'default'];
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
