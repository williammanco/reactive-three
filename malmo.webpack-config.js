module.exports = () => ({
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    library: 'reactive-three',
    umdNamedDefine: true,
  },
  externals: {
    react: 'react',
    'prop-types': 'prop-types',
    three: 'three',
  },
});
