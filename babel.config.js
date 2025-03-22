module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // NativeWind v2 babel plugin
      "nativewind/babel",
      'react-native-reanimated/plugin'
    ],
  };
}; 