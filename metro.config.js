// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure no duplicate extensions by filtering out existing ones
const defaultAssetExts = config.resolver.assetExts || [];
const additionalAssetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

// Filter out duplicates and add new extensions
config.resolver.assetExts = Array.from(
  new Set([...defaultAssetExts, ...additionalAssetExts])
);

// Increase cache size to prevent bundling issues
config.maxWorkers = 2;
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

module.exports = config; 