module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
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
          '@db': './src/db',
        },
      },
    ],
    'react-native-worklets/plugin',
  ],
};
