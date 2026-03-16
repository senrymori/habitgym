const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@ui-kits': path.resolve(__dirname, 'src/components/ui-kits'),
      '@screens': path.resolve(__dirname, 'src/screens'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@navigation': path.resolve(__dirname, 'src/navigation'),
      '@providers': path.resolve(__dirname, 'src/providers'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@server': path.resolve(__dirname, 'src/server'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
