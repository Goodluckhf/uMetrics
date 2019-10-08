module.exports = {
  env: {
    node: true,
  },
  extends: ['eslint-config-airbnb-base', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  rules: {
    'no-param-reassign': 0,
    'no-unused-expressions': 0,
    'no-underscore-dangle': [
      'error',
      {
        allowAfterThis: true,
      },
    ],
    'spaced-comment': 0,
  },
  overrides: [
    {
      files: ['*.server.test.js'],
      env: {
        mocha: true,
      },
      rules: {
        'no-underscore-dangle': 'off',
        'no-new': 'off',
      },
    },
  ],
};
