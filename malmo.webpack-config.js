module.exports = () => ({
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    library: 'ReactWrapThree',
    umdNamedDefine: true,
  },
  externals: {
    react: 'react',
    'prop-types': 'prop-types',
    three: 'three',
  },
});
