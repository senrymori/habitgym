module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.json', '.ts', '.tsx'],
        alias: {
          '@components': './src/components',
          '@ui-kits': './src/components/ui-kits',
          '@screens': './src/screens',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@navigation': './src/navigation',
          '@providers': './src/providers',
          '@assets': './src/assets',
          '@server': './src/server',
        },
      },
    ],
    'react-native-worklets/plugin',
  ],
};
