module.exports = {
  extends: 'eslint-config-egg/typescript',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
