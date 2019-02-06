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
    'react/forbid-prop-types': 'off',
    'no-return-assign': 'off',
  },
  settings: {
    'import/resolver': {
      '@malmo/eslint-config/resolver': {
        baseDir: path.resolve(__dirname),
      },
    },
  },
};
