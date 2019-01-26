const path = require('path');

module.exports = {
  extends: [
    '@malmo/eslint-config',
    'airbnb',
  ],
  rules: {
    'import/no-unresolved': 'off',
    'consistent-return': 'off',
    'no-param-reassign': 'off',
  },
  settings: {
    'import/resolver': {
      '@malmo/eslint-config/resolver': {
        baseDir: path.resolve(__dirname),
      },
    },
  },
};
