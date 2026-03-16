module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'import/prefer-default-export': 'off',
    'react-native/no-inline-styles': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
